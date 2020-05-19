import {WallStyle} from "../interfaces/StickyWallModel";
import RetroBoardServiceV1 from "../service/RetroBoard/RetroBoardServiceV1";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";

class RetroWall {
    retroBoardId: string
    wallId: string
    title: string
    style: WallStyle
    sortCards: boolean
    retroBoardService: RetroBoardService

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

    
}

export default RetroWall