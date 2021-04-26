import User from "../models/User";
import Note from "../models/Note";

export interface StickyNoteStyle {
    backgroundColor: string
    textColor: string
    likeBtnPosition: "right" | "left" | "none" | "inherit" | "initial" | "-moz-initial" | "revert" | "unset" | "inline-end" | "inline-start" | undefined
}

export interface StickyNoteState {
    show: boolean,
    message: string,
    stickyNoteId?: string
    showEditor: boolean,
    noteText: string,
    likedBy?: User[]
}

export interface StickyNoteProps {
    note: Note
}