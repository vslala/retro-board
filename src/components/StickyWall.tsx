import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import AddNewNote from "./AddNewNote";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import Note from "../models/Note";
import Badge from "react-bootstrap/Badge";
import Firebase from "../service/Firebase";
import RetroWall from "../models/RetroWall";
import Notes from "../models/Notes";

interface State {
    notes: Note[]
}

class StickyWall extends Component<StickyWallModel, State> {

    retroWall: RetroWall

    constructor(props: StickyWallModel) {
        super(props)
        this.addNote = this.addNote.bind(this)
        this.updateStickyNote = this.updateStickyNote.bind(this)
        this.retroWall = props.retroWall
    }

    state: State = {
        notes: [],
    }

    componentDidMount(): void {
        this.retroWall.retroBoardService.getNotes(this.retroWall.retroBoardId, this.retroWall.wallId)
            .then((notes) => {
                this.setState({notes: notes.notes})
            })
            .finally(() => this.retroWall.retroBoardService.getDataOnUpdate(
                this.retroWall.retroBoardId, this.retroWall.wallId, (notes:Notes) => {
                this.setState({notes:  [...notes.notes]})
            }))
        
    }

    addNote(note: string) {
        let prevState = this.state.notes
        let newState = prevState
        let newNote = new Note(this.retroWall.retroBoardId, this.retroWall.wallId, note, {
            backgroundColor: this.retroWall.style?.stickyNote?.backgroundColor || "white",
            textColor: this.retroWall.style?.stickyNote?.textColor || "black",
            likeBtnPosition: this.retroWall.style?.stickyNote?.likeBtnPosition || "right"
        }, this.retroWall.retroBoardService)
        newNote.createdBy.push(Firebase.getInstance().getLoggedInUser().email)
        newState.push(newNote)
        this.setState({notes: newState})

        // service call to update the database
        this.retroWall.retroBoardService.addNewNote(
            this.retroWall.retroBoardId, this.retroWall.wallId, newNote
        )
        // revert the state if note is not stored in the database
        .catch((e) => {
                console.log("Error adding new note to the wall", e)
                this.setState({notes: prevState})
            })

    }

    async updateStickyNote(modifiedNote: Note) {
        // give service call to update the sticky note
        return this.retroWall.retroBoardService.updateNote(modifiedNote)
    }

    deleteNote(e: React.MouseEvent, note: Note) {
        if (!note.createdBy.includes(Firebase.getInstance().getLoggedInUser().email))
            return
        let curr = e.currentTarget
        this.retroWall.retroBoardService.deleteNote(note)
            .catch((e) => console.log("Delete failed!", e))
    }

    render() {
        const {notes} = this.state
        let stickers = notes.map((stickyNote: Note, index: number) => (
            <ListGroupItem key={index} style={{padding: "0px", border: "none"}}>
                <Badge data-testid={`delete_badge_${index}`} variant={"light"} style={{cursor: "pointer"}}
                       onClick={(e: React.MouseEvent) => this.deleteNote(e, stickyNote)}>x</Badge>
                <StickyNote note={stickyNote} />
            </ListGroupItem>

        ))

        return (
            <section className="sticky-wall">
                <h3>{this.retroWall.title}</h3>
                <AddNewNote addNote={this.addNote}/>
                <ListGroup>
                    {stickers}
                </ListGroup>
            </section>
        )
    }
}

export default StickyWall









 /*
        // this method is called whenever there is a change in the properties
        public static getDerivedStateFromProps(props: StickyWallModel, state: State) {
            if (props.sortCards) {
                let notes = [...props.stickyNotes]
                notes = notes.sort((a, b) => {
                    if (a.likedBy.length > b.likedBy.length)
                        return -1
                    if (a.likedBy.length < b.likedBy.length)
                        return 1
                    return 0
                }).slice()
                return {notes: notes}
            }
        }
    */