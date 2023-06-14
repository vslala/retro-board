import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import Card from "react-bootstrap/Card";
import Editor from "./Editor";
import Like from "./Like";
import User from "../models/User";
import Note from "../models/Note";
import Badge from "react-bootstrap/Badge";
import Toast from "react-bootstrap/Toast";
import Firebase from "../service/Firebase";
import './sticky-note.css'
import StickyNoteViewModel from "../viewmodel/StickyNoteViewModel";
import {eventBus, EventRegistry} from "../common";
import RetroBoard from "../models/RetroBoard";

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

    const vm = useMemo(() => new StickyNoteViewModel(), []);

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
        vm.updateNoteText(modifiedNote);
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
        vm.deleteNote(note);
    }

    useEffect(() => {
        eventBus.subscribe(EventRegistry.CHANGE_BLUR_ON, (board: RetroBoard) => {
            setState((prevState) => ({...prevState, blur: board.blur}))
        });
        eventBus.subscribe(EventRegistry.CHANGE_BLUR_OFF, (board: RetroBoard) => {
            setState((prevState) => ({...prevState, blur: board.blur}))
        });
        eventBus.subscribe(EventRegistry.UPVOTE, (data) => {
            console.log("Upvote Received!");
            vm.handleUpvote(props.note, data.user);
            setState((prevState) => {
                if (prevState.likedBy !== undefined) {
                    const newLikedBy = [...prevState.likedBy, data.user];
                    return {...prevState, likedBy: newLikedBy};
                } else {
                    return {...prevState, likedBy: [data.user]}
                }
            });
        })
    }, []);

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
                          note={note}
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
