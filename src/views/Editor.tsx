import React, {useState} from 'react'
import {FormControl, InputGroup} from "react-bootstrap";

interface Props {
    handleEnter: (note: string) => void,
    noteText?: string
}

interface State {
    editorText: string
}

const Editor: React.FunctionComponent<Props> = (props) => {

    const [state, setState] = useState<State>({
        editorText: props.noteText ? props.noteText : ""
    });

    const handleKeyboardKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            props.handleEnter(state.editorText.replace(/\n/g, ""))
        }
        if (e.key === 'Enter') {
            setState({editorText: ""})
            props.handleEnter(state.editorText.replace(/\n/g, ""))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let editorText = e.currentTarget.value
        setState({editorText: editorText})
    }

    return <InputGroup>
        <FormControl as={"textarea"} autoFocus
                     data-testid={"editor_textarea"}
                     onKeyUp={handleKeyboardKeyPress}
                     onChange={handleChange} value={state.editorText} aria-label={"Note Editor"}
                     onBlur={() => props.handleEnter(state.editorText.replace(/\n/g, ""))}
        />
    </InputGroup>
}

export default Editor
