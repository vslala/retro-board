import StickyNote from "../components/StickyNote";
import {StickyNoteStyle} from "./StickyNoteModel";

export interface WallStyle {
    stickyNote: StickyNoteStyle
}

export interface StickyWallModel {
    title: string
    stickyNotes: StickyNote[]
    style: WallStyle | undefined
}