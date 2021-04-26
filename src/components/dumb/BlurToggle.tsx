import * as React from 'react';
import {useContext} from 'react';
import Firebase from "../../service/Firebase";
import {Form, InputGroup} from "react-bootstrap";
import {BoardContext} from "../../redux/context/BoardContext";
import RetroBoardServiceFactory from "../../service/RetroBoard/RetroBoardServiceFactory";

interface Props {
    callback: () => void
}

const BlurToggle: React.FunctionComponent = () => {
    const [boardProps, setBoardProps] = useContext<any>(BoardContext);

    // if the board is not created by the logged in user
    // then do not show the blur feature
    if (boardProps.uid !== Firebase.getInstance().getLoggedInUser()!.uid) {
        return <></>
    }

    const handleChange = async (val: "on" | "off") => {
        // save the state in the backend
        // the overall state update will happen at the listener in RetroBoardPage inside useEffect()
        let board = await RetroBoardServiceFactory.getInstance().getRetroBoardById(boardProps.uid, boardProps.boardId);
        board.blur = val;
        await RetroBoardServiceFactory.getInstance().updateRetroBoard(board);
    }

    let isChecked = boardProps.blur === "on";

    return <div className={"blur-toggle-wrapper"}>
        <InputGroup>
            <Form.Check
                checked={isChecked}
                type={"switch"}
                id={"switch_on"}
                label={"Blur On"}
                onChange={() => handleChange(isChecked ? "off" : "on")}
            />
        </InputGroup>
    </div>
}

export default BlurToggle;