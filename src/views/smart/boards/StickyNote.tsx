import React, {ReactNode, useState} from 'react'
import Card from "react-bootstrap/Card";
import Editor from "../../dumb/boards/Editor";
import Like from "../../dumb/boards/Like";
import User from "../../../models/User";
import Note from "../../../models/Note";
import Badge from "react-bootstrap/Badge";
import Toast from "react-bootstrap/Toast";
import Firebase from "../../../service/Firebase";
import './sticky-note.css'
import {eventBus} from "../../../common";

interface State {
    showToast: boolean,
    toastMessage: string,
    stickyNoteId?: string
    showEditor: boolean,
    noteText: string,
    likedBy?: User[],
    blur: string
}

interface Props {
    note: Note
}

const StickyNote: React.FunctionComponent<Props> = (props) => {

    eventBus.subscribe("BOARD:WALL:NOTE:LIKE:INCREMENT", (newLikeCount: number) => {});

    const [state, setState] = useState<State>({
        showToast: false,
        toastMessage: "",
        stickyNoteId: props.note.noteId,
        showEditor: false,
        noteText: props.note.noteText,
        likedBy: props.note.likedBy,
        blur: "off"
    });

    const handleOnClick = () => {
        console.log("Condition: ", props.note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid));
        console.log(`${props.note.createdBy} === ${Firebase.getInstance().getLoggedInUser()!.uid}`);
        // only allow edit if the note is created by the user
        // do not allow people to edit others note
        if (props.note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid)) {
            let noteText = state.noteText
            setState((prevState) => ({...prevState, showEditor: true, noteText: noteText}));
        }

    }

    const modifyStickyNote = (modifiedNote: Note) => {
        setState((prevState) => ({...prevState, showEditor: false, noteText: modifiedNote.noteText}));
        eventBus.publish("BOARD:WALL:NOTE:UPDATE", modifiedNote);
    }

    const _mergeNoteIfRequired = (note: Note): string | any => {
        let blur = state.blur === "on"
        && !note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid) ? "blur(3px)" : "blur(0px)"

        let cardBodyContent: ReactNode = <div className={"card-text"} style={{width: "95%", filter: blur}}>
            <p>{note.noteText}</p>
        </div>
        if (note.noteText.includes("  ")) {
            let mergedNotes = note.noteText.split("  ")
                .map((noteText, index) => (<div key={index}>
                    <p>{note.noteText}</p>
                    <hr/>
                </div>))
            cardBodyContent = <div className={"card-text"} style={{width: "95%", filter: blur}}>{mergedNotes}</div>
        }

        return cardBodyContent
    }

    const deleteNote = (note:Note) => {

    }

    let note = props.note
    let cardBodyContent = _mergeNoteIfRequired(note)

    return (
        <Card className={"sticky-note z-depth-5"} style={{backgroundColor: note.style?.backgroundColor || "white"}}>
            <Card.Body data-testid={"card_body"}
                       style={{padding: "5px", fontFamily: "sans-serif", fontWeight: 500, minHeight: "50px"}}
                       onClick={handleOnClick}>
                <div data-testid={"editor"}
                     style={{color: note.style?.textColor || "black"}}>
                    {
                        state.showEditor ?
                            <Editor noteText={note.noteText}
                                    handleEnter={(modifiedNoteText) => modifyStickyNote({
                                        ...note,
                                        noteText: modifiedNoteText
                                    })}/> :
                            cardBodyContent
                    }
                </div>
            </Card.Body>
            <ul className={"list-inline pull-right"} style={{position: 'absolute', right: "5px", bottom: "0px"}}>
                <li className="list-inline-item">
                    <Like key={`like_note.noteId`}
                          stickyNoteId={note.noteId}
                    />
                </li>
                <li className={"list-inline-item"}>
                    <Badge data-testid={`delete_badge_${note.noteId}`} bg={"danger"}
                           style={{cursor: "pointer", padding: "2px", margin: "0"}}
                           onClick={() => deleteNote(note)}><i
                        className="fa fa-trash-o"></i></Badge>
                </li>
            </ul>
            <Toast data-testid={"toast"} show={state.showToast} style={{position: 'absolute', left: '50%'}}>
                <Toast.Body>{state.toastMessage}</Toast.Body>
            </Toast>
        </Card>
    )
}

export default StickyNote;
