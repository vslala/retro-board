import React, {Component} from 'react'
import StickyNote from "./StickyNote";
import {StickyWallModel} from "../interfaces/StickyWallModel";
import AddNewNote from "./AddNewNote";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import Note from "../models/Note";
import Firebase from "../service/Firebase";
import RetroWall from "../models/RetroWall";
import {connect} from "react-redux";
import {Dispatch} from 'redux'
import {RetroBoardActionTypes, SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";

interface State {
    notes: Note[]
}

interface DispatchProps {
    addNewNote: (note: Note) => Promise<RetroBoardActionTypes>
    updateNote: (note: Note) => Promise<RetroBoardActionTypes>
    getNotes: (retroBoardId: string, wallId: string) => Promise<RetroBoardActionTypes>
    deleteNote: (note: Note) => Promise<RetroBoardActionTypes>
    sortByVotes: () => Promise<RetroBoardActionTypes>
}

interface Props extends StickyWallModel, State, DispatchProps {
    sortBy?: SortType
}

class StickyWall extends Component<Props, State> {

    retroWall: RetroWall

    constructor(props: Props) {
        super(props)
        this.addNote = this.addNote.bind(this)
        this.retroWall = props.retroWall
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.handleDragOver = this.handleDragOver.bind(this)
    }

    state: State = {
        notes: [],
    }

    componentDidMount(): void {
        this.props.retroWall.retroBoardService.getDataOnUpdate(this.retroWall.retroBoardId, this.retroWall.wallId, () => {
            console.log("Data Changed!")
            this.props.getNotes(this.retroWall.retroBoardId, this.retroWall.wallId)
        })
    }

    addNote(note: string) {
        let newNote = new Note(this.retroWall.retroBoardId, this.retroWall.wallId, note, {
            backgroundColor: this.retroWall.style?.stickyNote?.backgroundColor || "white",
            textColor: this.retroWall.style?.stickyNote?.textColor || "black",
            likeBtnPosition: this.retroWall.style?.stickyNote?.likeBtnPosition || "right"
        })
        newNote.createdBy.push(Firebase.getInstance().getLoggedInUser()!.email)
        this.props.addNewNote(newNote).then(() => {
            this.props.sortByVotes()
        })
    }

    deleteNote(note: Note) {
        if (!note.createdBy?.includes(Firebase.getInstance().getLoggedInUser()!.email))
            return
        this.props.deleteNote(note)
    }
    
    handleDrop(e: React.DragEvent<HTMLAnchorElement>, droppedOnNote: Note) {
        const draggedNote = JSON.parse(e.dataTransfer.getData("text/plain")) as Note
        if (draggedNote.noteId === droppedOnNote.noteId)
            return
            
        droppedOnNote.noteText += "<MERGE_NOTE>" + draggedNote.noteText
        this.props.updateNote({...droppedOnNote}).then(() => {
            this.deleteNote(draggedNote)
        })
    } 
    
    handleDragOver(e: React.DragEvent<HTMLAnchorElement>) {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }
    
    handleDragStart(e: React.DragEvent<HTMLAnchorElement>, note: Note) {
        e.dataTransfer.setData("text/plain", JSON.stringify(note))
    }

    render() {
        const {notes} = this.props
        
        let stickers = notes.filter((note) => note.wallId === this.retroWall.wallId).map((stickyNote: Note, index: number) => (
            <ListGroupItem key={index} style={{padding: "0px", border: "none", marginBottom: "2px"}} 
                className={"text-left"}
                id={`list_group_item_${index}`}
                draggable={true}
                onDragStart={(e: React.DragEvent<HTMLAnchorElement>) => this.handleDragStart(e, stickyNote)}
                onDragOver={this.handleDragOver}
                onDrop={(e: React.DragEvent<HTMLAnchorElement>) => this.handleDrop(e, stickyNote)}
                >
                <StickyNote key={stickyNote.noteId} note={stickyNote} retroBoardService={this.retroWall.retroBoardService} sortBy={this.props.sortBy}/>
            </ListGroupItem>

        ))

        return (
            <section className="sticky-wall text-center">
                <h3>{this.retroWall.title}</h3>
                <AddNewNote addNote={this.addNote}/>
                <ListGroup>
                    {stickers}
                </ListGroup>
            </section>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RetroBoardActionTypes>) => {
    const service = RetroBoardService.getInstance()
    const retroBoardActions = new RetroBoardActions();
    
    return {
        addNewNote: async (note: Note) => dispatch(retroBoardActions.createNote(await service.addNewNote(note))),
        updateNote: async (note: Note) => dispatch(retroBoardActions.updateNote(await service.updateNote(note))),
        deleteNote: async (note: Note) => dispatch(retroBoardActions.deleteNote(await service.deleteNote(note))),
        getNotes: async (retroBoardId: string, wallId: string) => dispatch(retroBoardActions.getNotes(await service.getNotes(retroBoardId, wallId))),
        sortByVotes: async () => dispatch(retroBoardActions.sortByVotes())
    }
}

export default connect(null, mapDispatchToProps)(StickyWall)


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