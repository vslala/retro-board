import * as React from 'react';
import CreateRetroBoard from "./CreateRetroBoard";
import {RetroBoardService} from "../../../service/RetroBoard/RetroBoardService";
import {RouteComponentProps, withRouter} from "react-router-dom";
import RetroWalls from "../../../models/RetroWalls";
import RetroWall from "../../../models/RetroWall";
import {useDispatch} from "react-redux";
import RetroBoardActions from "../../../redux/actions/RetroBoardActions";
import {TemplateWall} from "../../../models/BoardTemplate";

interface Props extends RouteComponentProps {
    title: string
    retroBoardService: RetroBoardService;
    templateWalls: Array<TemplateWall>
}

const CreateBoardManager: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch();

    const handleCreateRetroBoard = async (boardInput: { title: string, maxLikes: number }) => {
        let retroBoardActions = new RetroBoardActions();
        let retroBoard = await props.retroBoardService.createNewRetroBoard(boardInput);
        dispatch(retroBoardActions.createRetroBoard(retroBoard));

        console.log("Template Walls -> ", props.templateWalls);

        let boardWalls = await props.retroBoardService.createRetroWalls(retroBoard.id, new RetroWalls(
            props.templateWalls.map((templateWall, index) =>
                RetroWall.newInstance(retroBoard.id, templateWall.wallTitle, templateWall.wallStyle)
                    .setWallOrder(templateWall.wallOrder))));

        props.history.push({
            pathname: `/retro-board/${retroBoard.userId}/${retroBoard.id}`,
            state: {walls: new RetroWalls(boardWalls)}
        });
    }

    return <>
        <CreateRetroBoard title={props.title} onCreateRetroBoard={handleCreateRetroBoard}/>
    </>
}

export default withRouter(CreateBoardManager);