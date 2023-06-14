import React, {useEffect, useMemo, useState} from 'react'
import StickyWall from "../components/sticky-wall/StickyWall";
import {Button, Col, Row} from "react-bootstrap";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import Notes from "../models/Notes";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";
import SortSelect from "../views/SortSelect";
import ShareBoard from "../views/ShareBoard";
import {ITeam} from "../models/Team";
import UnauthorizedException from "../service/UnauthorizedException";
import {useNavigate, useParams} from "react-router-dom";
import RetroWall from "../models/RetroWall";
import Note from "../models/Note";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import BlurToggle from "../views/BlurToggle";
import RetroBoardPageViewModel from "../viewmodel/RetroBoardPageViewModel";
import {eventBus, EventRegistry} from "../common";

interface LocationParams {
    uid?: string
    retroBoardId?: string
}

interface State {
    board: RetroBoard
    walls: RetroWalls
    notes: Notes
    sortSelectValue: SortType
    teams: Array<ITeam>
}

interface Props {

}

const RetroBoardPage: React.FunctionComponent<Props> = (props) => {
    const vm = useMemo(() => new RetroBoardPageViewModel(), []);
    const retroBoardService = useMemo(() => RetroBoardServiceFactory.getInstance(), []);
    const params = useParams() as LocationParams;
    const navigate = useNavigate();

    const {retroBoardId, uid} = params;

    const [state, setState] = useState<State>({
        notes: new Notes([]),
        board: new RetroBoard('', '', uid!),
        sortSelectValue: SortType.NONE,
        teams: [],
        walls: new RetroWalls([])
    });

    const initRetroBoard = async (retroBoardId: string, uid: string) => {
        eventBus.subscribe(EventRegistry.ERROR, (e) => {
            console.log("Error Received: ", e, e instanceof UnauthorizedException)
            if (e instanceof UnauthorizedException || e.code === 'ERR_BAD_REQUEST') {
                navigate("/unauthorized");
            }
        });
        // open duplex connection
        // this method is only called when there is some update in the backend
        retroBoardService.getRetroBoardDataOnUpdate(uid, retroBoardId, (retroBoard => {
            console.log("RetroBoard: ", retroBoard);
        }));

        const [retroBoard, teams, retroWalls] = await Promise.all([
                vm.getRetroBoard(uid, retroBoardId),
                vm.getMyTeams(),
                vm.getRetroWalls(retroBoardId)
            ]
        );

        if (retroBoard !== undefined) {
            document.title = retroBoard.name;
            setState((prevState) => {
                if (retroBoard !== undefined && retroWalls !== undefined && teams !== undefined) {
                    return {
                        ...prevState,
                        board: retroBoard,
                        walls: retroWalls,
                        teams: teams
                    }
                } else {
                    return prevState
                }
            })
        }
    }

    const convertJsonToCsv = (): { data: Data, headers: LabelKeyObject[] } => {

        let headers: LabelKeyObject[] = [
            {label: "Wall Name", key: "wallName"},
            {label: "Note", key: "noteText"},
            {label: "Up-votes", key: "upvotes"}
        ]
        let data: Data = []

        state.walls.walls.forEach((wall) => {
            state.notes.notes.forEach((note) => {
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
            return await retroBoardService.shareBoard(retroBoardId!, selectedTeams);
        } catch (e) {
            return false;
        }
    }


    useEffect(() => {
        localStorage.setItem("retroBoardId", retroBoardId!);

        if (retroBoardId && uid) {
            initRetroBoard(retroBoardId, uid);
        }
    }, []);

    return (
        <div style={{padding: "50px"}}>
            <Row>
                <h2 style={{borderBottom: "2px solid black"}}>{state.board.name}</h2>
            </Row>
            <Row>
                <Col>
                    <SortSelect/>
                </Col>
                <Col className={"align-self-center"}>
                    <BlurToggle retroBoard={state.board}/>
                </Col>
                <Col className={"align-self-center"}>
                    <div className="pull-right">
                        <ShareBoard teams={state.teams} shareWith={shareBoardWith}/>
                    </div>

                    <Button className={"pull-right"} style={{border: "1px solid black"}} variant={"light"}>
                        <CSVLink {...convertJsonToCsv()} target={"_blank"}
                                 filename={state.board.name}>
                            <i className="fa fa-file-excel-o" style={{color: "blue"}}/>
                        </CSVLink>
                    </Button>
                </Col>
            </Row>
            <Row>
                {
                    state.walls.walls.map((wall: RetroWall, index: number) => {
                        return <Col key={index}>
                            <StickyWall
                                wall={wall}
                                sortBy={state.sortSelectValue}
                            />
                        </Col>
                    })
                }
            </Row>
        </div>
    )

}

export default RetroBoardPage;
