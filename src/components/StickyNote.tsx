import React from 'react'
import {StickyNoteProps, StickyNoteState} from "../interfaces/StickyNoteModel";
import Card from "react-bootstrap/Card";
import Editor from "./Editor";
import Like from "./Like";
import User from "../models/User";
import Note from "../models/Note";

class StickyNote extends React.Component<StickyNoteProps, StickyNoteState> {

    constructor(props: StickyNoteProps) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this)
        this.modifyStickyNote = this.modifyStickyNote.bind(this)
        this.handleUpVote = this.handleUpVote.bind(this)
    }

    state: StickyNoteState = {
        stickyNoteId: "1",
        showEditor: false,
        noteText: this.props.noteText,
        likedBy: []
    }

    handleOnClick(): void {
        let noteText = this.state.noteText
        this.setState({showEditor: true, noteText: noteText})
    }

    modifyStickyNote(modifiedNoteText: string) {
        let prevState = this.state.noteText
        this.setState({showEditor: false, noteText: modifiedNoteText})
        if (this.props.modifyStickyNote)
            this.props.modifyStickyNote({
                retroBoardId: this.props.retroBoardId,
                wallId: this.props.wallId,
                noteId: this.props.noteId,
                noteText: modifiedNoteText,
                style: this.props.style,
                retroBoardService: this.props.retroBoardService,
                likedBy: this.state.likedBy!
            })
                .catch((e) => {
                    console.log("Error updating the note: ", e)
                    this.setState({noteText: prevState})
                })
    }

    handleUpVote(user: User) {
        let users = this.state.likedBy!
        let hasVotedBefore = users.filter((u) => u.email === user.email).length > 0
        if (!hasVotedBefore) {
            users.push(user as User)
            let newUsersState = users
            this.setState({likedBy: newUsersState})

            let note = new Note(this.props.retroBoardId, this.props.wallId, this.state.noteText, this.props.style, this.props.retroBoardService)
            note.noteId = this.props.noteId
            note.likedBy = users
            console.log("Liked Note: ", note)
            this.props.retroBoardService.updateNote(note)
        }


    }


    render() {
        let style = this.props.style
        return (
            <Card style={{backgroundColor: style?.backgroundColor || "white"}}>
                <Card.Body>
                    <div data-testid={"editor"} onClick={this.handleOnClick}
                         style={{color: style?.textColor || "black"}}>
                        {
                            this.state.showEditor ?
                                <Editor noteText={this.state.noteText} handleEnter={this.modifyStickyNote}/> :
                                <p className="card-text">{this.state.noteText}</p>
                        }
                    </div>
                    <div style={{float: style?.likeBtnPosition || "right"}}>
                        <Like handleUpVote={this.handleUpVote}
                              likedBy={this.props.likedBy!}
                              stickyNoteId={this.state.stickyNoteId!}/></div>
                </Card.Body>
            </Card>
        )
    }
}

export default StickyNote