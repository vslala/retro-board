
export interface StickyNoteModel {
    showEditor: boolean,
    noteText: string
}

export interface StickyNoteProps {
    noteText: string
    modifyStickyNote?: (newNote: string) => void
}