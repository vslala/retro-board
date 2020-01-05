import {StickyNoteProps, StickyNoteStyle} from "../interfaces/StickyNoteModel";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import User from "./User";

class Note implements StickyNoteProps {
    retroBoardId: string
    retroBoardService: RetroBoardService
    wallId: string;
    noteId: string;
    noteText: string;
    style: StickyNoteStyle;
    likedBy: User[]
    
    constructor(retroBoardId: string, wallId: string, noteText:string, style:StickyNoteStyle, retroBoardService: RetroBoardService) {
        this.retroBoardId = retroBoardId
        this.wallId = wallId
        this.noteId = String(Date.now())
        this.noteText = noteText
        this.style = style
        this.retroBoardService = retroBoardService
        this.likedBy = []
    }


    
}

export default Note