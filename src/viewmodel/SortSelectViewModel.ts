import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import {eventBus, EventRegistry} from "../common";

class SortSelectViewModel {
    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }


    public publishSortEvent(sortBy: string) {
        if (sortBy === String(SortType.SORT_BY_VOTES)) {
            eventBus.publish(EventRegistry.SORT_BY_VOTES, undefined);
        }

        return SortType.SORT_BY_VOTES;
    }
}

export default SortSelectViewModel;
