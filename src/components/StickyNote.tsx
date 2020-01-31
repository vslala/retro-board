import React, {ReactNode} from 'react'
import {StickyNoteProps, StickyNoteState} from "../interfaces/StickyNoteModel";
import Card from "react-bootstrap/Card";
import Editor from "./Editor";
import Like from "./Like";
import User from "../models/User";
import Note from "../models/Note";
import {RetroBoardActionTypes, SortType} from "../redux/types/RetroBoardActionTypes";
import {Dispatch} from "redux";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import {connect} from "react-redux";
import Badge from "react-bootstrap/Badge";
import RetroBoardState from "../redux/reducers/RetroBoardState";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import Notes from "../models/Notes";
import Toast from "react-bootstrap/Toast";
import Firebase from "../service/Firebase";

interface StateFromReduxStore {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    notes: Notes
}

interface DispatchProps {
    updateNote: (note: Note) => Promise<RetroBoardActionTypes>
    deleteNote: (note: Note) => Promise<RetroBoardActionTypes>
    sortByVotes: () => Promise<RetroBoardActionTypes>
}

interface Props extends StickyNoteProps, DispatchProps, StateFromReduxStore {
    retroBoardService: RetroBoardService
    sortBy?: SortType
}

class StickyNote extends React.Component<Props, StickyNoteState> {

    constructor(props: Props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this)
        this.modifyStickyNote = this.modifyStickyNote.bind(this)
        this.handleUpVote = this.handleUpVote.bind(this)
    }

    componentDidMount(): void {
        let note = this.props.note
        this.props.retroBoardService.getNoteWhenLiked(note, (note: Note) => {
            if (note) // check is for delete case
                this.props.updateNote(note)
        })
    }

    state: StickyNoteState = {
        showToast: false,
        toastMessage: "",
        stickyNoteId: this.props.note.noteId,
        showEditor: false,
        noteText: this.props.note.noteText,
        likedBy: this.props.note.likedBy
    }

    handleOnClick(): void {
        // only allow edit if the note is created by the user
        // do not allow people to edit others note
        if (this.props.note.createdBy.includes(Firebase.getInstance().getLoggedInUser()!.email)) {
            let noteText = this.state.noteText
            this.setState({showEditor: true, noteText: noteText})
        }
        
    }

    modifyStickyNote(modifiedNote: Note) {
        this.setState({showEditor: false, noteText: modifiedNote.noteText})
        this.props.updateNote(modifiedNote)
    }

    _getTotalLikesForUser(user: User) {
        let totalLikes = 0
        this.props.notes.notes.forEach((note) => {
            if (note.likedBy ? note.likedBy.some(u => u.uid === user.uid) : false) {
                totalLikes++
            }
        })

        return totalLikes
    }

    handleUpVote(user: User) {
        let users = this.props.note?.likedBy || []
        let hasVotedBefore = users.filter((u) => u.email === user.email).length > 0
        let totalLikes = this._getTotalLikesForUser(user)

        let maxAllowedLikes = this.props.retroBoard.maxLikes

        if (!hasVotedBefore && totalLikes < maxAllowedLikes) {
            users.push(user)
            this.setState({likedBy: users})

            let note = this.props.note
            note.likedBy = users

            this.props.updateNote(note).then(() => {
                if (this.props.sortBy === SortType.SORT_BY_VOTES)
                    this.props.sortByVotes()
            })
        } else {
            this.setState({showToast: true, toastMessage: "Like Count Limit Reached"})
            setTimeout(() => {
                this.setState({showToast: false})
            }, 2000)
        }

    }

    _mergeNoteIfRequired(note: Note) {
        let cardBodyContent: ReactNode = <div className={"card-text"} style={{width: "95%"}}><p>{note.noteText}</p>
        </div>
        if (note.noteText.includes("<MERGE_NOTE>")) {
            let mergedNotes = note.noteText.split("<MERGE_NOTE>")
                .map((noteText, index) => (<div key={index}><p>{noteText}</p>
                    <hr style={{borderTop: "1px dashed"}}/>
                </div>))
            cardBodyContent = <div className={"card-text"} style={{width: "80%"}}>{mergedNotes}</div>
        }

        return cardBodyContent
    }

    render() {

        let note = this.props.note
        let cardBodyContent = this._mergeNoteIfRequired(note)

        return (
            <Card className={"z-depth-5"} style={{backgroundColor: note.style?.backgroundColor || "white"}}>
                <Card.Body style={{padding: "5px", fontFamily: "sans-serif", fontWeight: 500, minHeight: "50px"}}
                           onClick={this.handleOnClick}>
                    <div data-testid={"editor"}
                         style={{color: note.style?.textColor || "black"}}>
                        {
                            this.state.showEditor ?
                                <Editor noteText={note.noteText}
                                        handleEnter={(modifiedNoteText) => this.modifyStickyNote({
                                            ...note,
                                            noteText: modifiedNoteText
                                        })}/> :
                                cardBodyContent
                        }
                    </div>
                </Card.Body>
                <ul className={"list-inline pull-right"} style={{position: 'absolute', right: "5px", bottom: "0px"}}>
                    <li className="list-inline-item">
                        <Like key={`like_note.noteId`} handleUpVote={this.handleUpVote}
                              likedBy={note.likedBy || []}
                              stickyNoteId={note.noteId}
                        />
                    </li>
                    <li className={"list-inline-item"}>
                        <Badge data-testid={`delete_badge_${note.noteId}`} variant={"danger"}
                               style={{cursor: "pointer", padding: "2px", margin: "0"}}
                               onClick={() => this.props.deleteNote(note)}><i
                            className="fa fa-trash-o"></i></Badge>
                    </li>
                </ul>
                <Toast data-testid={"toast"} show={this.state.showToast} style={{position: 'absolute', left: '50%'}}>
                    <Toast.Body>{this.state.toastMessage}</Toast.Body>
                </Toast>
            </Card>
        )
    }
}

const mapStateToProps = (state: RetroBoardState): RetroBoardState => {

    return {
        retroBoard: state.retroBoard,
        retroWalls: state.retroWalls,
        notes: state.notes
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RetroBoardActionTypes>) => {
    const service = RetroBoardService.getInstance()
    const retroBoardActions = new RetroBoardActions();
    return {
        updateNote: async (note: Note) => dispatch(retroBoardActions.updateNote(await service.updateNote(note))),
        deleteNote: async (note: Note) => dispatch(retroBoardActions.deleteNote(await service.deleteNote(note))),
        sortByVotes: async () => dispatch(retroBoardActions.sortByVotes())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StickyNote)