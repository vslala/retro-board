import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import Note from "../models/Note";
import {eventBus, EventRegistry} from "../common";

class EditorViewModel {
    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }



}

export default EditorViewModel;
