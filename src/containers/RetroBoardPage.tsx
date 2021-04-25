import React, {useEffect, useState} from 'react'
import StickyWall from "../components/smart/boards/StickyWall";
import {Button, Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";
import Firebase from "../service/Firebase";
import ShareBoard from "../components/dumb/ShareBoard";
import Team, {ITeam} from "../models/Team";
import UnauthorizedException from "../service/UnauthorizedException";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import TeamsServiceFactory from "../service/Teams/TeamsServiceFactory";
import {withRouter} from "react-router-dom";
import Note from "../models/Note";

interface Props extends RouteComponentProps<{}, any, { walls: RetroWalls } | any> {
    uid?: string
    retroBoardId?: string
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    notes: Notes
}

const SortSelect: React.FunctionComponent = () => {
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()
    const [sortSelectValue, setSortSelectValue] = useState(SortType.NONE)

    const handleSort = function (e: React.ChangeEvent<HTMLSelectElement>): void {
        let sortBy = e.target.value
        if (sortBy === String(SortType.SORT_BY_VOTES)) {
            dispatch(retroBoardActions.sortByVotes())
            setSortSelectValue(SortType.SORT_BY_VOTES)
        }
    }

    return <Form>
        <Form.Group>
            <Form.Label>Sort cards: </Form.Label>
            <FormControl as={"select"} onChange={handleSort} data-testid={"sort_select"}
                         value={String(sortSelectValue)}>
                <option defaultValue={String(SortType.NONE)}>select...</option>
                <option defaultValue={String(SortType.SORT_BY_VOTES)}
                        value={SortType.SORT_BY_VOTES}>Sort by Up-votes
                </option>
            </FormControl>
        </Form.Group>
    </Form>
}

const BlurToggle: React.FunctionComponent<Props> = (props: Props) => {
    const useSelector: TypedUseSelectorHook<RetroBoardState> = useReduxSelector
    const retroBoardState = useSelector(state => state)
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()

    // if the board is not created by the logged in user
    // then do not show the blur feature
    if (retroBoardState.retroBoard.userId !== Firebase.getInstance().getLoggedInUser()!.uid) {
        return <></>
    }

    const handleChange = async (val: "on" | "off") => {
        console.log("Value: ", val)

        let retroBoard: RetroBoard = {...retroBoardState.retroBoard}
        retroBoard.blur = val
        dispatch(retroBoardActions.createRetroBoard(await RetroBoardServiceFactory.getInstance().updateRetroBoard(retroBoard)))
    }

    let isChecked = retroBoardState.retroBoard.blur === "on" ? true : false;

    return <InputGroup className={"pull-right"}>
        <Form.Check
            checked={isChecked}
            type={"switch"}
            id={"switch_on"}
            label={"Blur On"}
            onChange={() => handleChange(isChecked ? "off" : "on")}
        />
    </InputGroup>
}

const RetroBoardPage:React.FunctionComponent<Props> = (props:Props) => {
    const [boardId, setBoardId] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [sortSelectValue, setSortSelectValue] = useState<SortType>(SortType.NONE);
    const [teams, setTeams] = useState<Array<Team>>([]);
    const [walls, setWalls] = useState<RetroWalls>(new RetroWalls([]));
    const [notes, setNotes] = useState<Notes>(new Notes([]));

    const dispatch = useDispatch();

    /**
     * converts the given JSON data into CSV file
     * the converted file can then be downloaded
     */
    const convertJsonToCsv = ():{ data: Data, headers: LabelKeyObject[] } => {
        let headers: LabelKeyObject[] = [
            {label: "Wall Name", key: "wallName"},
            {label: "Note", key: "noteText"},
            {label: "Up-votes", key: "upvotes"}
        ]

        let data: Data = []

        walls.walls.forEach((wall) => {
            notes.notes.forEach((note) => {
                if (note.wallId === wall.wallId) {
                    data.push(
                        {wallName: wall.title, noteText: note.noteText, upvotes: note.likedBy?.length || 0}
                    )
                }
            })
        })

        return {data: data, headers: headers}
    }

    /**
     * Shares the board with the selected teams
     * @param selectedTeams
     */
    const shareBoardWith = async (selectedTeams: Array<ITeam>): Promise<boolean> => {
        try {
            return await RetroBoardServiceFactory.getInstance().shareBoard(boardId, selectedTeams);
        } catch (e) {
            return false;
        }
    }

    useEffect(() => {
        let {retroBoardId, uid} = props.match.params as Props;
        if (retroBoardId === undefined)
            throw Error("Board ID is null!!!");
        localStorage.setItem("retroBoardId", retroBoardId!);
        if (retroBoardId && uid) {
            const initRetroBoard = async (boardId: string, uid: string) => {
                try {

                    let retroBoardService = RetroBoardServiceFactory.getInstance();
                    let teams = await TeamsServiceFactory.getInstance().getMyTeams();
                    let retroBoard = await retroBoardService.getRetroBoardById(uid, boardId);
                    let walls = await retroBoardService.getRetroWalls(retroBoardId!);
                    let notes:Array<Note> = [];

                    walls.walls.forEach(async wall => [...notes, (await retroBoardService.getNotes(boardId, wall.wallId)).notes]);

                    document.title = retroBoard.name;
                    // open duplex connection
                    // this method is only called when there is some update in the backend
                    await retroBoardService.getRetroBoardDataOnUpdate(uid, boardId, (retroBoard => {
                        console.log("RetroBoard: ", retroBoard);
                    }));

                    setBoardId(boardId);
                    setBoardTitle(retroBoard.name);
                    setTeams(teams);
                    setWalls(walls);
                    setNotes(new Notes(notes));
                } catch (e) {
                    if (e instanceof UnauthorizedException) {
                        props.history.push("/unauthorized");
                    }
                }
            }
            initRetroBoard(retroBoardId, uid);
        }
    }, []);


    let wallsData = walls.walls.map((wall, index) => {
        let {retroBoardId} = props.match.params as Props
        wall.retroBoardId = retroBoardId!
        return <Col key={index}>
            <StickyWall wall={wall}
                        sortBy={sortSelectValue}
                        />
        </Col>
    });

    let csv = convertJsonToCsv();

    return <div style={{padding: "50px"}}>
        <Row>
            <h2 style={{borderBottom: "2px solid black"}}>{boardTitle}</h2>
        </Row>
        <Row>
            <Col>
                <SortSelect/>
            </Col>
            <Col className={"align-self-center"}>
                <BlurToggle {...props} />
            </Col>
            <Col className={"align-self-center"}>
                <div className="pull-right">
                    <ShareBoard teams={teams} shareWith={shareBoardWith}/>
                </div>

                <Button className={"pull-right"} style={{border: "1px solid black"}} variant={"light"}>
                    <CSVLink data={csv.data} headers={csv.headers}  target={"_blank"}
                             filename={boardTitle}>
                        <i className="fa fa-file-excel-o" style={{color: "blue"}}/>
                    </CSVLink>
                </Button>
            </Col>
        </Row>
        <Row>
            {wallsData}
        </Row>
    </div>
}

export default withRouter(RetroBoardPage)