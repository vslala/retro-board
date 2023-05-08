import RetroBoard from "../models/RetroBoard";
import React from "react";
import {TypedUseSelectorHook, useDispatch} from "react-redux";
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {useSelector as useReduxSelector} from "react-redux/es/hooks/useSelector";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Firebase from "../service/Firebase";
import {Form, InputGroup} from "react-bootstrap";

interface Props {
    retroBoard: RetroBoard
}

const BlurToggle: React.FunctionComponent<Props> = (props: Props) => {
    const useSelector: TypedUseSelectorHook<RetroBoardState> = useReduxSelector
    const retroBoardState = useSelector(state => state)
    const retroBoardService = RetroBoardServiceFactory.getInstance();
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()

    // if the board is not created by the logged in user
    // then do not show the blur feature
    if (props.retroBoard.userId !== Firebase.getInstance().getLoggedInUser()!.uid) {
        return <></>
    }

    const handleChange = async (val: "on" | "off") => {
        console.log("Value: ", val)

        let retroBoard: RetroBoard = {...retroBoardState.retroBoard}
        retroBoard.blur = val
        dispatch(retroBoardActions.createRetroBoard(await retroBoardService.updateRetroBoard(retroBoard)))
    }

    let isChecked = props.retroBoard.blur === "on" ? true : false;

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

export default BlurToggle;
