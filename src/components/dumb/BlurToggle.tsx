import * as React from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector} from "react-redux";
import RetroBoardState from "../../redux/reducers/RetroBoardState";
import RetroBoardActions from "../../redux/actions/RetroBoardActions";
import Firebase from "../../service/Firebase";
import RetroBoard from "../../models/RetroBoard";
import RetroBoardServiceFactory from "../../service/RetroBoard/RetroBoardServiceFactory";
import {Form, InputGroup} from "react-bootstrap";

interface Props {

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

export default BlurToggle;