import React from 'react'
import {StickyNoteModel, StickyNoteProps} from "../interfaces/StickyNoteModel";
import Card from "react-bootstrap/Card";
import Editor from "./Editor";

class StickyNote extends React.Component<StickyNoteProps, StickyNoteModel> {
    
    constructor(props: StickyNoteProps) {
        super(props)
        
        this.handleOnClick = this.handleOnClick.bind(this)
        this.modifyStickyNote = this.modifyStickyNote.bind(this)
    }
    
    state: StickyNoteModel = {
        showEditor: false,
        noteText: this.props.noteText
    }
    
    handleOnClick(): void {
        let noteText = this.state.noteText
        this.setState({showEditor: true, noteText: noteText})
    }
    
    modifyStickyNote(modifiedNote: string) {
        console.log("Modified Note: ", modifiedNote)
        this.setState({showEditor: false, noteText: modifiedNote})
        if (this.props.modifyStickyNote) 
            this.props.modifyStickyNote(this)
    }
    

    render () {
    
        return (
        <Card onClick={this.handleOnClick}>
            <Card.Body>
                {
                this.state.showEditor ? 
                    <Editor noteText={this.state.noteText} handleEnter={this.modifyStickyNote} /> : 
                    <p className="card-text">{ this.state.noteText }</p>
                }
            </Card.Body>
        </Card>
        )
    }
}

export default StickyNote