import RetroBoardState from "./RetroBoardState";
import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import {ActionTypes, RetroBoardActionTypes} from "../types/RetroBoardActionTypes";
import {combineReducers} from "redux";

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
            let noteIndex = state.notes.notes.findIndex((note) => note.noteId === action.payload.noteId)
            const oldNotes = [...state.notes.notes]
            oldNotes.splice(noteIndex, 1)
            const newNotes = oldNotes
            
            return {
                ...state,
                notes: new Notes(newNotes)
            }

    }
    return initialState
}

const rootReducer = combineReducers({retroBoardReducer})

export {rootReducer}