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
    
    retroBoardService: RetroBoardService
    retroBoardId: string
    wallId: string
    
    constructor(props: StickyWallModel) {
        super(props)
        this.addNote = this.addNote.bind(this)
        this.updateStickyNote = this.updateStickyNote.bind(this)
        this.retroBoardService = this.props.retroBoardService!
        this.retroBoardId = localStorage.getItem(RetroBoardService.RETRO_BOARD_ID)!
        this.wallId = this.props.wallId
    }

    state: State = {
        notes: this.props.stickyNotes,
    }

    addNote(note: string) {
        let prevState = this.state.notes
        let newState = prevState
        let newNote = new Note(this.retroBoardId, this.wallId, note, {
            backgroundColor: this.props.style?.stickyNote?.backgroundColor || "white",
            textColor: this.props.style?.stickyNote?.textColor || "black",
            likeBtnPosition: this.props.style?.stickyNote?.likeBtnPosition || "right"
        }, this.retroBoardService)
        newState.push(newNote)
        this.setState({notes: newState})
        
        // service call to update the database
        this.retroBoardService.addNewNote(
            this.retroBoardId,
            this.props.wallId,
            newNote
        )
        // revert the state if note is not stored in the database
        .catch((e) => {
            console.log("Error adding new note to the wall", e)
            this.setState({notes: prevState})
        })
            
    }

    async updateStickyNote(modifiedNote: Note) {
        // give service call to update the sticky note
        return this.retroBoardService.updateNote(modifiedNote)
    }

    render() {
        const {notes} = this.state
        let stickers = notes.map((stickyNote: Note, index: number) => (
            <ListGroupItem key={index}>
                <StickyNote retroBoardId={this.retroBoardId} wallId={this.wallId} 
                    noteId={stickyNote.noteId} noteText={stickyNote.noteText} 
                    style={stickyNote.style}
                    modifyStickyNote={this.updateStickyNote}
                    retroBoardService={this.retroBoardService}
                    likedBy={stickyNote.likedBy || 0}
                    />
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