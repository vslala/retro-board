import React from 'react'
import {InputGroup, FormControl} from "react-bootstrap";

interface Props {
    handleEnter: (note: string) => void
}
interface EditorModel {
    editorText: string
}

class Editor extends React.Component<Props> {

    constructor(props: Props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    
    state: EditorModel = {
        editorText: ""
    }
    
    handleKeyboardKeyPress = (e: React.KeyboardEvent<FormControl>) => {
        console.log("Event Fired: ", e.key)
        if (e.key === 'Enter') {
            this.setState({editorText: ""})
            this.props.handleEnter(this.state.editorText)
        }
    }
    
    handleChange(e: React.FormEvent<HTMLInputElement>) {
        let editorText = e.currentTarget.value
        this.setState({editorText: editorText})
    }
    
    render() {
        return <InputGroup>
            <FormControl as={"textarea"} autoFocus
                data-testid={"editor_textarea"}
                onKeyUp={this.handleKeyboardKeyPress}
                onChange={this.handleChange} value={this.state.editorText} aria-label={"Note Editor"} />
        </InputGroup>
    }
}

export default Editor