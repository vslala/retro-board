import {StickyNoteModel} from "./StickyNoteModel";
import StickyNote from "../components/StickyNote";

export interface StickyWallModel {
    title: string
    stickyNotes: StickyNote[]
}