import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";
import Notes from "../../models/Notes";

export enum ActionTypes {
    SORT,
    GET_NOTES,
    RETRIEVE_RETRO_BOARD,
    UPDATE_NOTE,
    DELETE_NOTE,
    CREATE_NOTE,
    CREATE_RETRO_WALLS,
    CREATE_RETRO_BOARD,
    REFRESH_WALLS
}

export enum SortType {
    NONE,
    SORT_BY_VOTES,
    SORT_BY_TIMESTAMP
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

interface Sort {
    type: typeof ActionTypes.SORT
    payload: SortType
}

interface RefreshWalls {
    type: typeof ActionTypes.REFRESH_WALLS
    payload: RetroWalls
}

export type RetroBoardActionTypes = CreateRetroBoardAction | CreateRetroWallsAction | CreateNoteAction |
    UpdateNoteAction | DeleteNoteAction | GetNotesAction | Sort | RefreshWalls