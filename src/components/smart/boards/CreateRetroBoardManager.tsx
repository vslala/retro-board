import * as React from 'react';
import CreateRetroBoard from "./CreateRetroBoard";
import {RouteComponentProps, withRouter} from "react-router-dom";
import RetroWalls from "../../../models/RetroWalls";
import RetroWall from "../../../models/RetroWall";
import {useDispatch} from "react-redux";
import RetroBoardActions from "../../../redux/actions/RetroBoardActions";
import {TemplateWall} from "../../../models/BoardTemplate";
import RetroBoardServiceFactory from "../../../service/RetroBoard/RetroBoardServiceFactory";

interface Props extends RouteComponentProps {
    title: string
    templateWalls: Array<TemplateWall>
}

const CreateBoardManager: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch();

    const handleCreateRetroBoard = async (boardInput: { title: string, maxLikes: number }) => {
        let retroBoardService = RetroBoardServiceFactory.getInstance();
        let retroBoardActions = new RetroBoardActions();
        let retroBoard = await retroBoardService.createNewRetroBoard(boardInput);
        dispatch(retroBoardActions.createRetroBoard(retroBoard));

        console.log("Template Walls -> ", props.templateWalls);

        let boardWalls = await retroBoardService.createRetroWalls(retroBoard.id, new RetroWalls(
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