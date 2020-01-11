import React from 'react'
import {StickyNoteProps, StickyNoteState} from "../interfaces/StickyNoteModel";
import Card from "react-bootstrap/Card";
import Editor from "./Editor";
import Like from "./Like";
import User from "../models/User";
import Note from "../models/Note";
import {RetroBoardActionTypes} from "../redux/types/RetroBoardActionTypes";
import {Dispatch} from "redux";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import {connect} from "react-redux";

interface DispatchProps {
    updateNote: (note: Note) => Promise<RetroBoardActionTypes>
}

interface Props extends StickyNoteProps, DispatchProps {
    retroBoardService: RetroBoardService
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
        this.props.retroBoardService.getNoteWhenLiked(note, (note:Note) => {
            if (note) // check is for delete case
                this.props.updateNote(note)
        })
    }

    state: StickyNoteState = {
        stickyNoteId: "1",
        showEditor: false,
        noteText: this.props.note.noteText,
        likedBy: []
    }

    handleOnClick(): void {
        let noteText = this.state.noteText
        this.setState({showEditor: true, noteText: noteText})
    }

    modifyStickyNote(modifiedNote: Note) {
        this.setState({showEditor: false, noteText: modifiedNote.noteText})
        this.props.updateNote(modifiedNote)
    }

    handleUpVote(user: User) {
        let users = this.state.likedBy!
        let hasVotedBefore = users.filter((u) => u.email === user.email).length > 0
        if (!hasVotedBefore) {
            users.push(user as User)
            let newUsersState = users
            this.setState({likedBy: newUsersState})

            let note = this.props.note
            note.likedBy = users
            console.log("Liked Note: ", note)
            this.props.updateNote(note)
        }

    }


    render() {
        console.log("Rendering StickyNote component...")
        let note = this.props.note
        return (
            <Card style={{backgroundColor: note.style?.backgroundColor || "white"}}>
                <Card.Body>
                    <div data-testid={"editor"} onClick={this.handleOnClick}
                         style={{color: note.style?.textColor || "black"}}>
                        {
                            this.state.showEditor ?
                                <Editor noteText={note.noteText}
                                        handleEnter={(modifiedNoteText) => this.modifyStickyNote({
                                            ...note,
                                            noteText: modifiedNoteText
                                        })}/> :
                                <p className="card-text">{note.noteText}</p>
                        }
                    </div>
                    <div style={{float: note.style?.likeBtnPosition || "right"}}>
                        <Like key={`like_note.noteId`} handleUpVote={this.handleUpVote}
                              likedBy={note.likedBy || []}
                              stickyNoteId={note.noteId}/></div>
                </Card.Body>
            </Card>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<RetroBoardActionTypes>) => {
    const service = RetroBoardService.getInstance()
    const retroBoardActions = new RetroBoardActions();
    return {
        updateNote: async (note: Note) => dispatch(retroBoardActions.updateNote(await service.updateNote(note)))
    }
}

export default connect(null, mapDispatchToProps)(StickyNote)