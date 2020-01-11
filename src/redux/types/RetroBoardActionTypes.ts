import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";
import Notes from "../../models/Notes";

export enum ActionTypes {
    GET_NOTES,
    RETRIEVE_RETRO_BOARD,
    UPDATE_NOTE,
    DELETE_NOTE,
    CREATE_NOTE,
    CREATE_RETRO_WALLS,
    CREATE_RETRO_BOARD
}

interface CreateRetroBoardAction {
    type: typeof ActionTypes.CREATE_RETRO_BOARD
    payload: RetroBoard
}

interface CreateRetroWallsAction {
    type: typeof ActionTypes.CREATE_RETRO_WALLS
    payload: RetroWalls
}

interface CreateNoteAction {
    type: typeof ActionTypes.CREATE_NOTE
    payload: Note
}

interface UpdateNoteAction {
    type: typeof ActionTypes.UPDATE_NOTE
    payload: Note
}

interface DeleteNoteAction {
    type: typeof ActionTypes.DELETE_NOTE
    payload: Note
}

interface GetNotesAction {
    type: typeof ActionTypes.GET_NOTES
    payload: Notes
}

export type RetroBoardActionTypes = CreateRetroBoardAction | CreateRetroWallsAction | CreateNoteAction |
    UpdateNoteAction | DeleteNoteAction | GetNotesAction