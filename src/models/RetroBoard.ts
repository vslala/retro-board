import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import {WallStyle} from "../interfaces/StickyWallModel";


const WENT_WELL_WALL_STYLE: WallStyle = {
    stickyNote: {
        backgroundColor: "#009688",
        textColor: "white",
        likeBtnPosition: "right"
    }
}

const TO_IMPROVE_WALL_STYLE: WallStyle = {
    stickyNote: {
        backgroundColor: "#e91e63",
        textColor: "white",
        likeBtnPosition: "right"
    }
}

const ACTION_ITEMS_WALL_STYLE: WallStyle = {
    stickyNote: {
        backgroundColor: "#9c27b0",
        textColor: "white",
        likeBtnPosition: "right"
    }
}
export const RETRO_BOARD_STYLES = {
    wentWell: WENT_WELL_WALL_STYLE,
    toImprove: TO_IMPROVE_WALL_STYLE,
    actionItems: ACTION_ITEMS_WALL_STYLE
}

class RetroBoard implements RetroBoardModel {
    id: string
    name: string
    maxLikes:number
    blur: "on" | "off"

    constructor(id:string, name:string) {
        this.id = id
        this.name = name
        this.maxLikes = 5
        this.blur = "off"
    }
    
    public static toJSON(retroBoard: RetroBoard) {
        return JSON.stringify(retroBoard)
    }
    
    public static fromJSON(json:string): RetroBoard {
        return JSON.parse(json) as RetroBoard
    }
}

export default RetroBoard