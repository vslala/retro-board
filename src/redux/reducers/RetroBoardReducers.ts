import RetroBoardState from "./RetroBoardState";
import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import {ActionTypes, RetroBoardActionTypes} from "../types/RetroBoardActionTypes";
import Note from "../../models/Note";

export const initialState: RetroBoardState = {
    retroBoard: new RetroBoard("", ""),
    retroWalls: new RetroWalls([]),
    notes: new Notes([])
}

export function retroBoardReducer(state = initialState, action: RetroBoardActionTypes): RetroBoardState {

    switch (action.type) {
        case ActionTypes.CREATE_RETRO_BOARD:
            return {
                ...state,
                retroBoard: action.payload
            }
            
        case ActionTypes.CREATE_RETRO_WALLS:
            return {
                ...state,
                retroWalls: action.payload,
            }
            
        case ActionTypes.CREATE_NOTE:
            return {
                ...state,
                notes: new Notes([
                    ...state.notes.notes,
                    action.payload
                ])
            }
            
        case ActionTypes.UPDATE_NOTE:
            let modifiedNotes = state.notes.notes.map((note) => 
                note.noteId === action.payload.noteId ? Object.assign({}, note, action.payload) : note)
            
            return {
                ...state,
                notes: new Notes(modifiedNotes)
            }
            
        case ActionTypes.DELETE_NOTE:
            let notes: Note[] = []
            state.notes.notes.forEach((note) => {
                if (note.noteId !== action.payload.noteId)
                    notes.push(note)
            })
            
            return {
                ...state,
                notes: new Notes(notes)
            }
            
        case ActionTypes.GET_NOTES:
        
            return {
                ...state,
                notes: new Notes(state.notes.notes.concat(action.payload.notes))
            }
            
    }
    return initialState
}