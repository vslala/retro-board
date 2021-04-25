import React, {useEffect, useState} from 'react'
import StickyNote from "./StickyNote";
import AddNewNote from "../../dumb/boards/AddNewNote";
import {Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Note from "../../../models/Note";
import Firebase from "../../../service/Firebase";
import RetroWall from "../../../models/RetroWall";
import {SortType} from "../../../redux/types/RetroBoardActionTypes";
import RetroBoardServiceFactory from "../../../service/RetroBoard/RetroBoardServiceFactory";
import CarouselView from "../../dumb/CarouselView";

interface Props {
    sortBy?: SortType
    wall: RetroWall
}

const StickyWall:React.FunctionComponent<Props> = (props:Props) => {
    const [notes, setNotes] = useState<Array<Note>>([]);

    /**
     * add a new note to the wall
     * makes a service call to the backend
     * @param note
     */
    const addNote = async (note:string) => {
        let newNote = new Note(props.wall.retroBoardId, props.wall.wallId, note, {
            backgroundColor: props.wall.style?.stickyNote?.backgroundColor || "white",
            textColor: props.wall.style?.stickyNote?.textColor || "black",
            likeBtnPosition: props.wall.style?.stickyNote?.likeBtnPosition || "right"
        })
        newNote.createdBy = Firebase.getInstance().getLoggedInUser()!.email;
        setNotes([...notes, await RetroBoardServiceFactory.getInstance().addNewNote(newNote)]);
    }

    const handleDrop = async (e: React.DragEvent<HTMLAnchorElement>, droppedOnNote: Note) => {
        const draggedNote = JSON.parse(e.dataTransfer.getData("text/plain")) as Note
        if (draggedNote.noteId === droppedOnNote.noteId)
            return

        droppedOnNote.noteText += "  " + draggedNote.noteText; // markdown for line-break
        let modifiedNotes = notes.map((note) =>
            note.noteId === draggedNote.noteId ? Object.assign({}, note, droppedOnNote.noteText) : note)

        let note:Note = notes.find(note => note.noteId === droppedOnNote.noteId)!;
        note.noteText = droppedOnNote.noteText;

        // service calls to delete and update the notes
        let boardService = RetroBoardServiceFactory.getInstance();
        let updatedNote = await boardService.updateNote(note);
        let deletedNote = notes.find(note => note.noteId === draggedNote.noteId)!;
        await boardService.deleteNote(deletedNote);

        setNotes(modifiedNotes);
    }

    const handleDragOver = (e: React.DragEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>, note: Note) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(note))
    }

    /**
     * This is the starting point of this page
     * replacement of componentDidMount()
     */
    useEffect(() => {
        const getNotes = async () => {
            setNotes((await RetroBoardServiceFactory.getInstance().getNotes(props.wall.retroBoardId, props.wall.wallId)).notes);
        };
        RetroBoardServiceFactory.getInstance().getDataOnUpdate(props.wall.retroBoardId, props.wall.wallId, () => {
            console.log("Data Changed!")
            getNotes();
        });

        getNotes();
    }, []);

    let filteredNotes = notes.filter(note => note.wallId === props.wall.wallId);
    let stickers = filteredNotes.map((stickyNote: Note, index: number) => (
        <ListGroupItem key={index} style={{padding: "0px", border: "none", marginBottom: "2px"}}
                       className={"text-left"}
                       id={`list_group_item_${index}`}
                       draggable={true}
                       onDragStart={(e: React.DragEvent<HTMLAnchorElement>) => handleDragStart(e, stickyNote)}
                       onDragOver={handleDragOver}
                       onDrop={(e: React.DragEvent<HTMLAnchorElement>) => handleDrop(e, stickyNote)}
        >
            <StickyNote key={stickyNote.noteId} note={stickyNote} retroBoardService={RetroBoardServiceFactory.getInstance()} sortBy={props.sortBy}/>
        </ListGroupItem>

    ))

    return <section className="sticky-wall text-center">
        <h3>{props.wall.title} </h3>
        <Row>
            <Col>
                <CarouselView items={notes.map(note => note.noteText)} style={{textColor: notes[0]?.style.textColor, backgroundColor: notes[0]?.style.backgroundColor}} />
            </Col>
        </Row>
        <AddNewNote addNote={addNote}/>
        <ListGroup>
            {stickers}
        </ListGroup>
    </section>
}

export default StickyWall;


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