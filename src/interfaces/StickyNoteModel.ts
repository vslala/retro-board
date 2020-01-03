import StickyNote from "../components/StickyNote";
import User from "../models/User";

export interface StickyNoteStyle {
    backgroundColor: string
    textColor: string
    likeBtnPosition: "left" | "right"
}

export interface StickyNoteState {
    stickyNoteId?: string
    showEditor: boolean,
    noteText: string,
    likedBy?: User[]
}

export interface StickyNoteProps {
    noteText: string
    modifyStickyNote?: (modifiedNote: StickyNote) => void
    style: StickyNoteStyle
}