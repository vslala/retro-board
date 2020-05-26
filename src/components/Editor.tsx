import React from 'react'
import {FormControl, InputGroup} from "react-bootstrap";

interface Props {
    handleEnter: (note: string) => void,
    noteText?: string
}
interface EditorModel {
    editorText: string
}

class Editor extends React.Component<Props, EditorModel> {

    constructor(props: Props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    
    state: EditorModel = {
        editorText: this.props.noteText ? this.props.noteText : ""
    }
    
    handleKeyboardKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            this.props.handleEnter(this.state.editorText.replace(/\n/g, ""))
        }
        if (e.key === 'Enter') {
            this.setState({editorText: ""})
            this.props.handleEnter(this.state.editorText.replace(/\n/g, ""))
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
                onChange={this.handleChange} value={this.state.editorText} aria-label={"Note Editor"} 
                onBlur={() => this.props.handleEnter(this.state.editorText.replace(/\n/g, ""))}
                />
        </InputGroup>
    }
}

export default Editor