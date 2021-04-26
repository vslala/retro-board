import React, {ReactNode, useContext, useEffect, useState} from 'react'
import Card from "react-bootstrap/Card";
import Editor from "../../dumb/boards/Editor";
import Like from "../../dumb/boards/Like";
import User from "../../../models/User";
import Note from "../../../models/Note";
import Badge from "react-bootstrap/Badge";
import Toast from "react-bootstrap/Toast";
import Firebase from "../../../service/Firebase";
import RetroBoardServiceFactory from "../../../service/RetroBoard/RetroBoardServiceFactory";
import ReactMarkdown from 'react-markdown';
import './sticky-note.css'
import {BoardContext, BoardContextProvider} from "../../../redux/context/BoardContext";

interface Props {
    note: Note
    deleteNote: (note: Note) => void
    callBackWall: (note:Note) => void
}

const StickyNote: React.FunctionComponent<Props> = (props: Props) => {
    const [boardProps, setBoardProps] = useContext<any>(BoardContext);

    const [thisNote, setThisNote] = useState<Note>(props.note);
    const [showEditor, setShowEditor] = useState(false);
    const [toast, setToast] = useState({show: false, message: ""});

    const handleOnClick = () => {
        console.log("Condition: ", thisNote.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid));
        console.log(`${props.note.createdBy} === ${Firebase.getInstance().getLoggedInUser()!.uid}`);
        // only allow edit if the thisNote is created by the user
        // do not allow people to edit others thisNote
        if (props.note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid)) {
            let noteText = thisNote.noteText
            setShowEditor(true);
        }
    }

    const modifyStickyNote = async (modifiedNote: Note) => {
        let savedNote = await RetroBoardServiceFactory.getInstance().updateNote(modifiedNote);
        setShowEditor(false);
        // state is updated using the websocket callback method inside useEffect()
        // setThisNote(savedNote);
    }

    const mergeNoteIfRequired = (note: Note): string | any => {
        let blur = boardProps.blur === "on"
                            && !note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.uid) ? "blur(3px)" : "blur(0px)"

        let cardBodyContent: ReactNode = <div className={"card-text"} style={{width: "95%", filter: blur}}>
            <ReactMarkdown source={note.noteText} escapeHtml={true}/>
        </div>

        if (note.noteText.includes("  ")) {
            let mergedNotes = note.noteText.split("  ")
                .map((noteText, index) => (<div key={index}>
                    <ReactMarkdown source={noteText} escapeHtml={true}/>
                    <hr/>
                </div>))
            cardBodyContent = <div className={"card-text"} style={{width: "95%", filter: blur}}>{mergedNotes}</div>
        }

        return cardBodyContent
    }

    const handleUpVote = async (currentUser: User) => {
        let usersWhoUpVotedThisNote = thisNote.likedBy ?? [];
        let thisUserHasVotedAlready = usersWhoUpVotedThisNote
            .filter((u) => u.email === currentUser.email).length > 0;


        // count total votes made by the current user
        // on this board.
        // This is done to check the max vote limit of this user.
        let allNotesBelongingToCurrentBoard = await RetroBoardServiceFactory.getInstance().getNotes(boardProps.boardId, "");
        let totalVotesByCurrentUser = 0;
        allNotesBelongingToCurrentBoard.notes.forEach((note) => {
            if (note.likedBy ? note.likedBy.some(u => u.uid === currentUser.uid) : false) {
                totalVotesByCurrentUser++
            }
        });

        let maxAllowedVotes = boardProps.maxLikes
        if (!thisUserHasVotedAlready && totalVotesByCurrentUser < maxAllowedVotes) {
            // make a service call to update the total votes
            let modifiedNote = await RetroBoardServiceFactory.getInstance()
                .updateNote({...thisNote, likedBy: [...thisNote.likedBy, currentUser]});
            setThisNote(modifiedNote);
        } else {
            setToast({
                show: true,
                message: "Like Count Limit Reached"
            });
            // hide toast after 2 seconds.
            setTimeout(() => {
                setToast({...toast, show: false});
            }, 2000);
        }
    }

    const deleteNote = (note: Note) => {
        props.deleteNote(note);
    }


    useEffect(() => {
        RetroBoardServiceFactory.getInstance().getNoteDataWhenModified(props.note, (note: Note) => {
            // check is for delete case
            // if thisNote doesn't exist then it has been probably deleted.
            if (note) {
                setThisNote(note);
                props.callBackWall(note);
            }
        })
    }, []);

    const cardBodyContent = mergeNoteIfRequired(thisNote);

    return <BoardContextProvider>
        <Card className={"sticky-thisNote z-depth-5"}
              style={{backgroundColor: thisNote.style?.backgroundColor || "white"}}>
            <Card.Body data-testid={"card_body"}
                       style={{padding: "5px", fontFamily: "sans-serif", fontWeight: 500, minHeight: "50px"}}
                       onClick={handleOnClick}>
                <div data-testid={"editor"}
                     style={{color: thisNote.style?.textColor || "black"}}>
                    {
                        showEditor ?
                            <Editor noteText={thisNote.noteText}
                                    handleEnter={(modifiedNoteText) => modifyStickyNote({
                                        ...thisNote,
                                        noteText: modifiedNoteText
                                    })}/> :
                            cardBodyContent
                    }
                </div>
            </Card.Body>
            <ul className={"list-inline pull-right"} style={{position: 'absolute', right: "5px", bottom: "0px"}}>
                <li className="list-inline-item">
                    <Like key={`like_note.noteId`} handleUpVote={handleUpVote}
                          likedBy={thisNote.likedBy || []}
                          stickyNoteId={thisNote.noteId}
                    />
                </li>
                <li className={"list-inline-item"}>
                    <Badge data-testid={`delete_badge_${thisNote.noteId}`} variant={"danger"}
                           style={{cursor: "pointer", padding: "2px", margin: "0"}}
                           onClick={() => deleteNote(thisNote)}><i
                        className="fa fa-trash-o"></i></Badge>
                </li>
            </ul>
            <Toast data-testid={"toast"} show={toast.show} style={{position: 'absolute', left: '50%'}}>
                <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
        </Card>
    </BoardContextProvider>
}

export default StickyNote;