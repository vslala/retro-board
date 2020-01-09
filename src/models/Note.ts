import {StickyNoteStyle} from "../interfaces/StickyNoteModel";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import User from "./User";

class Note {
    retroBoardId: string
    retroBoardService: RetroBoardService
    wallId: string
    noteId: string
    noteText: string
    style: StickyNoteStyle
    likedBy: User[]
    createdBy: string[]
    
    constructor(retroBoardId: string, wallId: string, noteText:string, style:StickyNoteStyle, retroBoardService: RetroBoardService) {
        this.retroBoardId = retroBoardId
        this.wallId = wallId
        this.noteId = String(Date.now())
        this.noteText = noteText
        this.style = style
        this.retroBoardService = retroBoardService
        this.likedBy = []
        this.createdBy = []
    }

    public static toJSON(note:Note): string {
        return JSON.stringify(note)
    }
    
    public static fromJSON(json:string): Note {
        return JSON.parse(json)
    }

    
}

export default Note