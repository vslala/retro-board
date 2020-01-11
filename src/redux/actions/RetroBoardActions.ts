import RetroBoard from "../../models/RetroBoard";
import {ActionTypes, RetroBoardActionTypes} from "../types/RetroBoardActionTypes";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";

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
}

export default RetroBoardActions