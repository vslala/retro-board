import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import AddNewNote from "./AddNewNote";

interface State {
    notes: string[]
}

class StickyWall extends Component<StickyWallModel, State> {

    constructor(props: StickyWallModel) {
        super(props)
        this.addNote = this.addNote.bind(this)
    }
    
    state: State = {
        notes: this.props.stickyNotes
    }
    
    addNote(note: string) {
        let newNotes = this.state.notes
        newNotes.push(note)
        this.setState({notes: newNotes})
    }

    render() {
        const {stickyNotes, title} = this.props
        let stickers = stickyNotes.map((note: string, index: number) => (
            <StickyNote key={index} noteText={note}/>
        ))

        return (
            <section className="sticky-wall">
                <h3>{title}</h3>
                <AddNewNote addNote={this.addNote} />
                {stickers}
            </section>
        )
    }
}

export default StickyWall