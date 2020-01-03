import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import RetroWall from "./RetroWall";
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
    retroWalls: RetroWall[]

    constructor(id:string, retroWalls: RetroWall[]) {
        this.retroWalls = retroWalls
        this.id = id
    }
}

export default RetroBoard