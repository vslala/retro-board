import {StickyNoteProps, StickyNoteStyle} from "../interfaces/StickyNoteModel";

class Note implements StickyNoteProps {
    noteId: string;
    noteText: string;
    style: StickyNoteStyle;
    
    constructor(noteText:string, style:StickyNoteStyle) {
        this.noteId = String(Date.now())
        this.noteText = noteText
        this.style = style
    }

    
}

export default Note