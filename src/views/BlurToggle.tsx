import RetroBoard from "../models/RetroBoard";
import React, {useMemo} from "react";
import Firebase from "../service/Firebase";
import {Form, InputGroup} from "react-bootstrap";
import BlurToggleViewModel from "../viewmodel/BlurToggleViewModel";

interface Props {
    retroBoard: RetroBoard
}

const BlurToggle: React.FunctionComponent<Props> = (props: Props) => {
    const vm = useMemo(() => new BlurToggleViewModel(), [])

    // if the board is not created by the logged in user
    // then do not show the blur feature
    if (props.retroBoard.userId !== Firebase.getInstance().getLoggedInUser()!.uid) {
        return <></>
    }

    const handleChange = async (val: "on" | "off") => {
        console.log("Value: ", val)
        let updatedBoard = vm.updateBoardBlur(props.retroBoard, val);
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
