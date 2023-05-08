import React, {useEffect, useMemo, useState} from 'react'
import StickyWall from "../views/smart/boards/StickyWall";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {TypedUseSelectorHook, useDispatch, useSelector, useSelector as useReduxSelector} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";
import SortSelect from "../views/SortSelect";
import Firebase from "../service/Firebase";
import ShareBoard from "../views/dumb/ShareBoard";
import TeamsServiceV1 from "../service/Teams/TeamsServiceV1";
import {ITeam} from "../models/Team";
import UnauthorizedException from "../service/UnauthorizedException";
import {useLocation, useMatch, useNavigate, useParams} from "react-router-dom";
import RetroWall from "../models/RetroWall";
import Note from "../models/Note";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import BlurToggle from "../views/BlurToggle";

interface LocationParams {
    uid?: string
    retroBoardId?: string
}

interface State {
    retroBoardId: string
    retroBoardTitle: string
    sortSelectValue: SortType
    teams: Array<ITeam>
    retroWalls: RetroWalls
}

interface Props {

}

const RetroBoardPage: React.FunctionComponent<Props> = (props) => {
    const retroBoardService = useMemo(() => RetroBoardServiceFactory.getInstance(), []);
    const retroBoardActions = useMemo(() => new RetroBoardActions(), []);
    const teamsService = TeamsServiceV1.getInstance();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const {retroBoardId, uid} = params as LocationParams;

    const [state, setState] = useState<State>({
        retroBoardId: "",
        retroBoardTitle: "",
        sortSelectValue: SortType.NONE,
        teams: [],
        retroWalls: new RetroWalls([])
    });

    const {retroBoard, retroWalls, notes} = useSelector((state: RetroBoardState) => ({
        retroBoard: state.retroBoard,
        retroWalls: state.retroWalls,
        notes: state.notes
    }));

    const dispatch = useDispatch();

    const initRetroBoard = async (retroBoardId: string, uid: string) => {

        try {

            let retroBoard = await retroBoardService.getRetroBoardById(uid, retroBoardId);
            document.title = retroBoard.name;

            let teams = await teamsService.getMyTeams();

            // open duplex connection
            // this method is only called when there is some update in the backend
            await retroBoardService.getRetroBoardDataOnUpdate(uid, retroBoardId, (retroBoard => {
                console.log("RetroBoard: ", retroBoard);
            }));

            await dispatch(retroBoardActions.createRetroBoard(retroBoard));
            let retroWalls = await retroBoardService.getRetroWalls(retroBoardId);

            setState((prevState) => ({
                ...prevState, retroBoardId: retroBoardId,
                retroBoardTitle: retroBoard.name,
                teams: teams,
                retroWalls: retroWalls
            }))
        } catch (e) {
            if (e instanceof UnauthorizedException) {
                navigate("/unauthorized");
            }
        }
    }
    const convertJsonToCsv = (): { data: Data, headers: LabelKeyObject[] } => {

        let headers: LabelKeyObject[] = [
            {label: "Wall Name", key: "wallName"},
            {label: "Note", key: "noteText"},
            {label: "Up-votes", key: "upvotes"}
        ]
        let data: Data = []

        retroWalls.walls.forEach((wall) => {
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
    const shareBoardWith = async (selectedTeams: Array<ITeam>): Promise<boolean> => {

        try {
            return await retroBoardService.shareBoard(state.retroBoardId, selectedTeams);
        } catch (e) {
            return false;
        }
    }


    let walls = state.retroWalls.walls.map((wall: RetroWall, index: number) => {
        wall.retroBoardId = retroBoardId!
        return <Col key={index}>
            <StickyWall
                wall={wall}
                sortBy={state.sortSelectValue}
            />
        </Col>
    });

    useEffect(() => {
        localStorage.setItem("retroBoardId", retroBoardId!);

        if (retroBoardId && uid) {
            initRetroBoard(retroBoardId, uid);
        }
    }, []);

    return (
        <div style={{padding: "50px"}}>
            <Row>
                <h2 style={{borderBottom: "2px solid black"}}>{state.retroBoardTitle}</h2>
            </Row>
            <Row>
                <Col>
                    <SortSelect/>
                </Col>
                <Col className={"align-self-center"}>
                    <BlurToggle retroBoard={retroBoard}/>
                </Col>
                <Col className={"align-self-center"}>
                    <div className="pull-right">
                        <ShareBoard teams={state.teams} shareWith={shareBoardWith}/>
                    </div>

                    <Button className={"pull-right"} style={{border: "1px solid black"}} variant={"light"}>
                        <CSVLink {...convertJsonToCsv()} target={"_blank"}
                                 filename={retroBoard.name}>
                            <i className="fa fa-file-excel-o" style={{color: "blue"}}/>
                        </CSVLink>
                    </Button>
                </Col>
            </Row>
            <Row>
                {walls}
            </Row>
        </div>
    )

}

export default RetroBoardPage;
