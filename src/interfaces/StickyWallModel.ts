import {StickyNoteStyle} from "./StickyNoteModel";
import Note from "../models/Note";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";

export interface WallStyle {
    stickyNote: StickyNoteStyle
}

export interface StickyWallModel {
    wallId: string
    title: string
    stickyNotes: Note[]
    style: WallStyle | undefined
    retroBoardService?: RetroBoardService
}