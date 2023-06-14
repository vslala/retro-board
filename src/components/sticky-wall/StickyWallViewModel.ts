import Note from "../../models/Note";
import {RetroBoardService} from "../../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../../service/RetroBoard/RetroBoardServiceFactory";
import {eventBus, EventRegistry} from "../../common";
import Notes from "../../models/Notes";

class StickyWallViewModel {

    private retroBoardService: RetroBoardService

    constructor() {
        this.retroBoardService = RetroBoardServiceFactory.getInstance();
    }

    public sortByVotes(notes: Note[]) {
        return notes.sort((item1, item2) => {
            let itemOneLikesCount = 0
            let itemTwoLikesCount = 0

            if (item1.likedBy)
                itemOneLikesCount = item1.likedBy.length
            if (item2.likedBy)
                itemTwoLikesCount = item2.likedBy.length

            return 0 - (itemOneLikesCount > itemTwoLikesCount ? 1 : -1)
        });
    }

    async createNewNote(note: Note) {
        try {
            let newNote = this.retroBoardService.addNewNote(note);
            eventBus.publish(EventRegistry.CREATE_NOTE, newNote);

            return newNote;
        } catch (e) {
            eventBus.publish(EventRegistry.ERROR, e);
        }

    }

    updateNote(note: Note) {
        try {
            let updatedNote = this.retroBoardService.updateNote(note);
            eventBus.publish(EventRegistry.UPDATE_NOTE, updatedNote);

            return updatedNote;
        } catch (e) {
            eventBus.publish(EventRegistry.ERROR, e);
        }
    }

    deleteNote(note: Note) {
        try {
            let deletedNote = this.retroBoardService.deleteNote(note);
            eventBus.publish(EventRegistry.DELETE_NOTE, deletedNote);

            return deletedNote;
        } catch (e) {
            eventBus.publish(EventRegistry.ERROR, e);
        }
    }

    filterNotes(notes: Notes, wallId: string) {
        return notes.notes.filter(n => n.wallId === wallId);
    }
}

export default StickyWallViewModel;
