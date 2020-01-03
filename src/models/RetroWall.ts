import {Wall} from "../interfaces/RetroBoardModel";
import StickyNote from "../components/StickyNote";
import {WallStyle} from "../interfaces/StickyWallModel";

class RetroWall implements Wall {
    notes: StickyNote[]
    title: string
    style: WallStyle

    constructor(title: string, notes: StickyNote[], style: WallStyle) {
        this.notes = notes
        this.title = title
        this.style = style
    }
    
    public static newInstance(title:string, style: WallStyle) {
        return new RetroWall(title, [], style)
    }
}

export default RetroWall