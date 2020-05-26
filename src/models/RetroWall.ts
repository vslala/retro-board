import {WallStyle} from "../interfaces/StickyWallModel";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";

class RetroWall {
    retroBoardId: string
    wallId: string
    title: string
    style: WallStyle
    sortCards: boolean
    retroBoardService: RetroBoardService
    wallOrder: number = 1

    constructor(retroBoardId:string, title: string, style: WallStyle, retroBoardService: RetroBoardService) {
        this.retroBoardId = retroBoardId
        this.wallId = title.replace(/\s/g, "")
        this.title = title
        this.style = style
        this.sortCards = false
        this.retroBoardService = retroBoardService
    }
    
    public static newInstance(retroBoardId:string, title:string, style: WallStyle, retroBoardService: RetroBoardService) {
        return new RetroWall(retroBoardId, title, style, retroBoardService)
    }

    public setWallOrder(wallOrder:number): RetroWall {
        this.wallOrder = wallOrder;
        return this;
    }

    
}

export default RetroWall