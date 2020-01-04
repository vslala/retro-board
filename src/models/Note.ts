import {StickyNoteProps, StickyNoteStyle} from "../interfaces/StickyNoteModel";

class Note implements StickyNoteProps {
    id: string
    noteText: string;
    style: StickyNoteStyle;
    
    constructor(noteText:string, style:StickyNoteStyle) {
        this.id = String(Date.now())
        this.noteText = noteText
        this.style = style
    }
}

export default Note