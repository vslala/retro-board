import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import TeamsServiceV1 from "../service/Teams/TeamsServiceV1";
import {eventBus, EventRegistry} from "../common";

class RetroBoardPageViewModel {
    private retroBoardService: RetroBoardService
    private teamsService: TeamsServiceV1

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
        this.teamsService = TeamsServiceV1.getInstance();
    }

    async getRetroBoard(uid: string, boardId: string) {
        try {
            return await this.retroBoardService.getRetroBoardById(uid, boardId);
        } catch (e) {
            eventBus.publish(EventRegistry.ERROR, e);
        }
    }

    async getMyTeams() {
        try {
            return await this.teamsService.getMyTeams();
        } catch (e) {
            eventBus.publish(EventRegistry.ERROR, e);
        }
    }

    async getRetroWalls(retroBoardId: string) {
        try {
            return await this.retroBoardService.getRetroWalls(retroBoardId);
        } catch (e) {
            console.log("Exception encountered!");
            eventBus.publish(EventRegistry.ERROR, e);
        }
    }
}

export default RetroBoardPageViewModel;
