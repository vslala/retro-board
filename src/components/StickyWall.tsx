import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import AddNewNote from "./AddNewNote";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import Note from "../models/Note";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";

interface State {
    notes: Note[]
}

class StickyWall extends Component<StickyWallModel, State> {

    constructor(props: StickyWallModel) {
        super(props)
        this.addNote = this.addNote.bind(this)
        this.updateStickyNote = this.updateStickyNote.bind(this)
    }

    state: State = {
        notes: this.props.stickyNotes,
    }

    addNote(note: string) {
        this.props.retroBoardService!.addNewNote(
            localStorage.getItem(RetroBoardService.RETRO_BOARD_ID)!,
            this.props.wallId,
            new Note(note, {
                backgroundColor: this.props.style?.stickyNote?.backgroundColor || "white",
                textColor: this.props.style?.stickyNote?.textColor || "black",
                likeBtnPosition: this.props.style?.stickyNote?.likeBtnPosition || "right"
            })
        )
        .then((wall) => {
            console.log("Sticky Notes: ", wall!.notes)
            this.setState({notes: wall!.notes})
        })
            
    }

    updateStickyNote(modifiedNote: StickyNote) {
        // give service call to update the sticky note
    }

    render() {
        const {notes} = this.state
        let stickers = notes.map((stickyNote: Note, index: number) => (
            <ListGroupItem key={index}>
                <StickyNote noteText={stickyNote.noteText} style={stickyNote.style}/>
            </ListGroupItem>

        ))

        return (
            <section className="sticky-wall">
                <h3>{this.props.title}</h3>
                <AddNewNote addNote={this.addNote}/>
                <ListGroup>
                    {stickers}
                </ListGroup>
            </section>
        )
    }
}

export default StickyWall