import {WallStyle} from "../interfaces/StickyWallModel";

class RetroWall {
    retroBoardId: string
    wallId: string
    title: string
    style: WallStyle
    sortCards: boolean
    wallOrder: number = 1

    constructor(retroBoardId:string, title: string, style: WallStyle) {
        this.retroBoardId = retroBoardId
        this.wallId = title.replace(/\s/g, "")
        this.title = title
        this.style = style
        this.sortCards = false
    }
    
    public static newInstance(retroBoardId:string, title:string, style: WallStyle) {
        return new RetroWall(retroBoardId, title, style)
    }

    public setWallOrder(wallOrder:number): RetroWall {
        this.wallOrder = wallOrder;
        return this;
    }

    
}

export default RetroWall