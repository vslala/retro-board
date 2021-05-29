import React, {useContext, useEffect, useState} from 'react'
import StickyWall from "../components/smart/boards/StickyWall";
import {Button, Col, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import Notes from "../models/Notes";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";
import ShareBoard from "../components/dumb/ShareBoard";
import {Team, TeamListResponse} from "../models/Team";
import UnauthorizedException from "../service/UnauthorizedException";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import TeamsServiceFactory from "../service/Teams/TeamsServiceFactory";
import {withRouter} from "react-router-dom";
import {BoardContext} from "../redux/context/BoardContext";
import BlurToggle from "../components/dumb/BlurToggle";

interface CSVTemplate {
    data: Data,
    headers: LabelKeyObject[]
}

interface Props extends RouteComponentProps<{}, any, { walls: RetroWalls } | any> {
    uid?: string
    retroBoardId?: string
}

const RetroBoardPage: React.FunctionComponent<Props> = (props: Props) => {

    let {retroBoardId, uid} = props.match.params as Props;
    if (retroBoardId === undefined)
        throw Error("Board ID is null!!!");
    localStorage.setItem("retroBoardId", retroBoardId!);

    const [boardProps, setBoardProps] = useContext<any>(BoardContext);

    const [boardId, setBoardId] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [sortSelectValue, setSortSelectValue] = useState<SortType>(SortType.NONE);
    const [teams, setTeams] = useState<Array<Team>>([]);
    const [walls, setWalls] = useState<RetroWalls>(new RetroWalls([]));
    const [csvData, setCSVData] = useState<CSVTemplate>({data: [], headers: []});

    /**
     * converts the given JSON data into CSV file
     * the converted file can then be downloaded
     */
    const convertJsonToCsv = async (): Promise<void> => {
        let headers: LabelKeyObject[] = [
            {label: "Wall Name", key: "wallName"},
            {label: "Note", key: "noteText"},
            {label: "Up-votes", key: "upvotes"}
        ]

        // fetch all notes for the board
        let walls = await RetroBoardServiceFactory.getInstance().getRetroWalls(retroBoardId!);
        let notes: Notes = await RetroBoardServiceFactory.getInstance().getNotes(retroBoardId!, "");
        console.log("Retro Board Id: ", notes);

        let data: Data = [];
        walls.walls.forEach(wall => {
            let wallNotes = notes.notes.filter(note => note.wallId === wall.wallId);
            wallNotes.forEach(note => {
                data.push({wallName: wall.title, noteText: note.noteText, upvotes: note.likedBy?.length ?? 0});
            })
        })

        console.log("CSV DAtA: ", data);
        setCSVData({data: data, headers: headers});
    }

    /**
     * Shares the board with the selected teams
     * @param selectedTeams
     */
    const shareBoardWith = async (selectedTeams: Array<Team>): Promise<boolean> => {
        try {
            return await RetroBoardServiceFactory.getInstance().shareBoard(boardId, selectedTeams);
        } catch (e) {
            return false;
        }
    }


    let wallsData = walls.walls.map((wall, index) => {
        let {retroBoardId} = props.match.params as Props
        wall.retroBoardId = retroBoardId!
        return <Col key={index}>
            <StickyWall wall={wall}
                        sortBy={sortSelectValue}
                        callBack={convertJsonToCsv}
            />
        </Col>
    });

    useEffect(() => {
        if (retroBoardId && uid) {
            // this code will always run when board will be updated in the backend
            RetroBoardServiceFactory.getInstance().getRetroBoardDataOnUpdate(uid, retroBoardId, async (retroBoard: RetroBoard) => {
                setBoardProps({
                    ...boardProps,
                    uid: uid,
                    boardId: retroBoard.id,
                    maxLikes: retroBoard.maxLikes,
                    blur: retroBoard.blur
                });
            });
            const initRetroBoard = async (boardId: string, uid: string) => {
                try {

                    let retroBoardService = RetroBoardServiceFactory.getInstance();
                    let teamListResponse: TeamListResponse = await TeamsServiceFactory.getInstance().getMyTeams();
                    let retroBoard = await retroBoardService.getRetroBoardById(uid, boardId);
                    let walls = await retroBoardService.getRetroWalls(retroBoardId!);
                    await convertJsonToCsv();
                    document.title = retroBoard.name;

                    setBoardProps({
                        ...boardProps,
                        boardId: retroBoard.id,
                        maxLikes: retroBoard.maxLikes,
                        uid: uid,
                    })
                    setBoardId(boardId);
                    setBoardTitle(retroBoard.name);
                    setTeams(teamListResponse.teams);
                    setWalls(walls);

                } catch (e) {
                    if (e instanceof UnauthorizedException) {
                        props.history.push("/unauthorized");
                    }
                }
            }
            initRetroBoard(retroBoardId, uid);
        }
    }, []);

    return <div style={{padding: "50px"}}>
        <Row className={"justify-content-center my-1"} style={{borderBottom: "1px solid white"}}>
            <Col className={"col-sm-3"}>
                <h2>{boardTitle}</h2>
            </Col>
            <Col>
                <BlurToggle />
            </Col>
            <Col className={"align-self-center"}>
                <div className="pull-right">
                    <ShareBoard teams={teams} shareWith={shareBoardWith}/>
                </div>

                <Button className={"pull-right"} style={{border: "1px solid black"}} variant={"light"}>
                    <CSVLink data={csvData.data} headers={csvData.headers} target={"_blank"}
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