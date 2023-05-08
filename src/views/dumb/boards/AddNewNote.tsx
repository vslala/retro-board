import React from 'react'
import {Button} from "react-bootstrap";
import Editor from "./Editor";

interface State {
    showEditor: boolean
}

interface Props {
    addNote: (note: string) => void
}

class AddNewNote extends React.Component<Props, State> {

    state: State = {
        showEditor: false
    }
    
    constructor(props: Props) {
        super(props)
        this.showEditor = this.showEditor.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
    }

    showEditor() {
        
        this.setState({showEditor: true})
    }
    
    handleEnter(note: string) {
        if ("" === note)
            return ;
        this.props.addNote(note)
        this.setState({showEditor: false})
    }

    render() {
        if (this.state.showEditor) {
            return <div style={{margin: "5px"}}>
                <Editor handleEnter={this.handleEnter} />
            </div>
        }
        return <div style={{margin: "5px"}}>
            <Button title={"Add new note"} data-testid={"add_new_note_btn"} variant={"dark"} onClick={this.showEditor}>
                <i className={"fa fa-lg fa-plus"}></i>
            </Button>
        </div>
    }
}

export default AddNewNote