import RetroBoard from "../../models/RetroBoard";
import {ActionTypes, RetroBoardActionTypes, SortType} from "../types/RetroBoardActionTypes";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";
import Notes from "../../models/Notes";

class RetroBoardActions {
    
    public createRetroBoard(retroBoard: RetroBoard): RetroBoardActionTypes {
        return {
            type: ActionTypes.CREATE_RETRO_BOARD,
            payload: retroBoard
        }
    }
    
    public createRetroWalls(retroWalls: RetroWalls): RetroBoardActionTypes {
        return {
            type: ActionTypes.CREATE_RETRO_WALLS,
            payload: retroWalls
        }
    }
    
    public createNote(note: Note): RetroBoardActionTypes {
        return {
            type: ActionTypes.CREATE_NOTE,
            payload: note
        }
    }
    
    public updateNote(note: Note): RetroBoardActionTypes {
        return {
            type: ActionTypes.UPDATE_NOTE,
            payload: note
        }
    }
    
    public deleteNote(note: Note): RetroBoardActionTypes {
        return {
            type: ActionTypes.DELETE_NOTE,
            payload: note
        }
    }

    public getNotes(notes: Notes): RetroBoardActionTypes {
        return {
            type: ActionTypes.GET_NOTES,
            payload: notes
        }
    }

    public sortByVotes(): RetroBoardActionTypes {
        return {
            type: ActionTypes.SORT,
            payload: SortType.SORT_BY_VOTES
        };
    }
    
    public sortByTimestamp(): RetroBoardActionTypes {
        return {
            type: ActionTypes.SORT,
            payload: SortType.SORT_BY_TIMESTAMP
        };
    }
}

export default RetroBoardActions