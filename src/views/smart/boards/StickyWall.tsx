import React, {useEffect, useMemo, useState} from 'react'
import StickyNote from "./StickyNote";
import AddNewNote from "../../dumb/boards/AddNewNote";
import {Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Note from "../../../models/Note";
import Firebase from "../../../service/Firebase";
import RetroWall from "../../../models/RetroWall";
import {useDispatch} from "react-redux";
import {SortType} from "../../../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../../../redux/actions/RetroBoardActions";
import RetroBoardServiceFactory from "../../../service/RetroBoard/RetroBoardServiceFactory";
import CarouselView from "../../dumb/CarouselView";
import Notes from "../../../models/Notes";
import notes from "../../../models/Notes";

interface State {
    notes: Note[]
}

interface Props {
    sortBy?: SortType
    wall: RetroWall
}

const StickyWall: React.FunctionComponent<Props> = (props) => {
    const retroBoardActions = new RetroBoardActions();
    const retroBoardService = useMemo(() => RetroBoardServiceFactory.getInstance(), []);
    const [state, setState] = useState<State>({notes: []});

    const dispatch = useDispatch();


    const addNote = async (note: string) => {
        let retroWall = props.wall;
        let newNote = new Note(retroWall.retroBoardId, retroWall.wallId, note, {
            backgroundColor: retroWall.style?.stickyNote?.backgroundColor || "white",
            textColor: retroWall.style?.stickyNote?.textColor || "black",
            likeBtnPosition: retroWall.style?.stickyNote?.likeBtnPosition || "right"
        })
        newNote.createdBy = Firebase.getInstance().getLoggedInUser()!.email;

        dispatch(retroBoardActions.createNote(await retroBoardService.addNewNote(newNote)));
        dispatch(retroBoardActions.sortByVotes());
    }

    const handleDrop = async (e: React.DragEvent<HTMLAnchorElement>, droppedOnNote: Note) => {
        const draggedNote = JSON.parse(e.dataTransfer.getData("text/plain")) as Note
        if (draggedNote.noteId === droppedOnNote.noteId)
            return

        droppedOnNote.noteText += "  " + draggedNote.noteText; // markdown for line-break

        dispatch(retroBoardActions.updateNote(await retroBoardService.updateNote(droppedOnNote)));
        dispatch(retroBoardActions.deleteNote(await retroBoardService.deleteNote(draggedNote)));
    }

    const handleDragOver = (e: React.DragEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>, note: Note) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(note))
    }

    // let wallNotes = state.notes.filter((note: Note) => note.wallId === props.wall.wallId);
    let stickers = state.notes.map((stickyNote: Note, index: number) => (
        <ListGroupItem key={index} style={{padding: "0px", border: "none", marginBottom: "2px"}}
                       className={"text-left"}
                       id={`list_group_item_${index}`}
                       draggable={true}
                       onDragStart={(e: React.DragEvent<HTMLAnchorElement>) => handleDragStart(e, stickyNote)}
                       onDragOver={handleDragOver}
                       onDrop={(e: React.DragEvent<HTMLAnchorElement>) => handleDrop(e, stickyNote)}
        >
            <StickyNote key={stickyNote.noteId} note={stickyNote} />
        </ListGroupItem>

    ))

    useEffect(() => {
        const init = async () => {
            const notes: Notes = await retroBoardService.getNotes(props.wall.retroBoardId, props.wall.wallId);
            setState({notes: notes.notes});
            retroBoardService.getDataOnUpdate(props.wall.retroBoardId, props.wall.wallId, async (newNotes) => {
                console.log("Data Changed!")
                setState({notes: newNotes.notes});
            })
        }

        init();
    }, []);

    return (
        <section className="sticky-wall text-center">
            <h3>{props.wall.title} </h3>
            <Row>
                <Col>
                    <CarouselView items={state.notes.map((note: Note) => note.noteText)} style={{
                        textColor: state.notes[0]?.style.textColor,
                        backgroundColor: state.notes[0]?.style.backgroundColor
                    }}/>
                </Col>
            </Row>
            <AddNewNote addNote={addNote}/>
            <ListGroup>
                {stickers}
            </ListGroup>
        </section>
    )
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
