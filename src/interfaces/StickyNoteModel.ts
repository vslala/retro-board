import User from "../models/User";
import Note from "../models/Note";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";

export interface StickyNoteStyle {
    backgroundColor: string
    textColor: string
    likeBtnPosition: "right" | "left" | "none" | "inherit" | "initial" | "-moz-initial" | "revert" | "unset" | "inline-end" | "inline-start" | undefined
}

export interface StickyNoteState {
    stickyNoteId?: string
    showEditor: boolean,
    noteText: string,
    likedBy?: User[]
}

export interface StickyNoteProps {
    retroBoardId: string
    wallId: string
    noteId: string
    noteText: string
    modifyStickyNote?: (modifiedNote: Note) => Promise<void>
    style: StickyNoteStyle
    retroBoardService: RetroBoardService
    likedBy?: User[]
    createdBy: string[]
}