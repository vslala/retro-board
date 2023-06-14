import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import RetroBoard from "../models/RetroBoard";
import {eventBus, EventRegistry} from "../common";

class MyBoardsViewModel {
    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }

    public async getMyBoards() {
        return this.retroBoardService.getMyBoards();
    }

    async deleteBoard(board: RetroBoard) {
        let retroBoardId = await this.retroBoardService.deleteBoard(board);
        eventBus.publish(EventRegistry.DELETE_BOARD, board);

        return retroBoardId;
    }
}

export default MyBoardsViewModel;
