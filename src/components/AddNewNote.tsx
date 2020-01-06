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
        console.log("Show editor!")
        this.setState({showEditor: true})
    }
    
    handleEnter(note: string) {
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
            <Button data-testid={"add_new_note_btn"} variant={"dark"} onClick={this.showEditor}>Add New Note</Button>
        </div>
    }
}

export default AddNewNote