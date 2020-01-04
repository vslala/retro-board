import {StickyWallModel, WallStyle} from "../interfaces/StickyWallModel";
import Note from "./Note";

class RetroWall implements StickyWallModel {
    wallId: string
    notes: Note[]
    title: string
    style: WallStyle
    stickyNotes: Note[];

    constructor(title: string, notes: Note[], style: WallStyle) {
        this.wallId = title.replace(" ", "")
        this.notes = notes
        this.title = title
        this.style = style
        this.stickyNotes = []
    }
    
    public static newInstance(title:string, style: WallStyle) {
        return new RetroWall(title, [], style)
    }

    
}

export default RetroWall