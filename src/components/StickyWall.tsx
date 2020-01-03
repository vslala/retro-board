import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import AddNewNote from "./AddNewNote";
import {ListGroup, ListGroupItem} from "react-bootstrap";

interface State {
    notes: StickyNote[]
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
        let newNotes = this.state.notes
        // @ts-ignore
        newNotes.push(<StickyNote style={{
            backgroundColor: this.props.style?.stickyNote?.backgroundColor || "white",
            textColor: this.props.style?.stickyNote?.textColor || "black",
            likeBtnPosition: this.props.style?.stickyNote?.likeBtnPosition || "right"
        }} noteText={note} modifyStickyNote={this.updateStickyNote} />)
        this.setState({notes: newNotes})
    }
    
    updateStickyNote(modifiedNote: StickyNote) {
        // give service call to update the sticky note
    }

    render() {
        const {stickyNotes, title} = this.props
        let stickers = stickyNotes.map((stickyNote: StickyNote, index: number) => (
            <ListGroupItem key={index}>
                {stickyNote}
            </ListGroupItem>
            
        ))

        return (
            <section className="sticky-wall">
                <h3>{title}</h3>
                <AddNewNote addNote={this.addNote} />
                <ListGroup>
                    {stickers}
                </ListGroup>
            </section>
        )
    }
}

export default StickyWall