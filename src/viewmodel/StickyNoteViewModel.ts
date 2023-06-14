import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import Note from "../models/Note";
import {eventBus, EventRegistry} from "../common";
import User from "../models/User";

class StickyNoteViewModel {

    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }

    public deleteNote(note: Note): Promise<Note> {
        let deletedNote = this.retroBoardService.deleteNote(note);
        eventBus.publish(EventRegistry.DELETE_NOTE, deletedNote);

        return deletedNote;
    }

    public updateNoteText(note: Note): Promise<Note> {
        let modifiedNote = this.retroBoardService.updateNote(note);
        eventBus.publish(EventRegistry.UPDATE_NOTE, modifiedNote);

        return modifiedNote;
    }

    handleUpvote(note: Note, user: User) {
        let toUpdate = {...note};
        if (!toUpdate.likedBy.find(u => u.uid === user.uid)) {
            toUpdate.likedBy.push(user);
        }
        let modifiedNote = this.retroBoardService.updateNote(toUpdate);

        return modifiedNote;
    }
}

export default StickyNoteViewModel;
