import StickyNote from "../components/StickyNote";

export interface StickyNoteModel {
    showEditor: boolean,
    noteText: string
}

export interface StickyNoteProps {
    noteText: string
    modifyStickyNote?: (modifiedNote: StickyNote) => void
}