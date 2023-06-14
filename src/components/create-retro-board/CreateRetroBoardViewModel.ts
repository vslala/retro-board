import {RetroBoardService} from "../../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../../service/RetroBoard/RetroBoardServiceFactory";
import {eventBus, EventRegistry} from "../../common";
import RetroWalls from "../../models/RetroWalls";
import RetroWall from "../../models/RetroWall";
import RetroBoard from "../../models/RetroBoard";
import CreateRetroBoardRequest from "../../models/CreateRetroBoardRequest";
import {TemplateWall} from "../../models/BoardTemplate";

class CreateRetroBoardViewModel {
    private retroBoardService:RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }

    public async createRetroBoard(request: CreateRetroBoardRequest) {
        let retroBoard = await this.retroBoardService.createNewRetroBoard(request);
        eventBus.publish(EventRegistry.CREATE_RETRO_BOARD, retroBoard);
        return retroBoard;
    }

    public async createWalls(retroBoard: RetroBoard, wallTemplates: Array<TemplateWall>) {
        let boardWalls:RetroWalls = await this.retroBoardService.createRetroWalls(retroBoard.id, new RetroWalls(
            wallTemplates.map((templateWall, index) =>
                RetroWall.newInstance(retroBoard.id, templateWall.wallTitle, templateWall.wallStyle)
                    .setWallOrder(templateWall.wallOrder))));

        return boardWalls;
    }
}

export default CreateRetroBoardViewModel;
