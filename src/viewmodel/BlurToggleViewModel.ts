import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import RetroBoard from "../models/RetroBoard";
import {eventBus, EventRegistry} from "../common";

class BlurToggleViewModel {
    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }


    updateBoardBlur(retroBoard: RetroBoard, val: "on" | "off") {
        let toUpdate = {...retroBoard, blur: val};
        let updatedBoard = this.retroBoardService.updateRetroBoard(toUpdate);

        if (val === 'on') {
            eventBus.publish(EventRegistry.CHANGE_BLUR_ON, updatedBoard);
        } else {
            eventBus.publish(EventRegistry.CHANGE_BLUR_OFF, updatedBoard);
        }

        return updatedBoard;
    }
}

export default BlurToggleViewModel;
