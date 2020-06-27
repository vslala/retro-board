import RetroBoardState from "./RetroBoardState";
import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import {ActionTypes, RetroBoardActionTypes, SortType} from "../types/RetroBoardActionTypes";
import Note from "../../models/Note";

export const initialState: RetroBoardState = {
    retroBoard: new RetroBoard("", "", ""),
    retroWalls: new RetroWalls([]),
    notes: new Notes([])
}

function sortByVotes(notes: Notes) {
    return new Notes(notes.notes.sort((item1, item2) => {
        let itemOneLikesCount = 0
        let itemTwoLikesCount = 0

        if (item1.likedBy)
            itemOneLikesCount = item1.likedBy.length
        if (item2.likedBy)
            itemTwoLikesCount = item2.likedBy.length

        return 0 - (itemOneLikesCount > itemTwoLikesCount ? 1 : -1)
    }))
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
            console.log("Get Notes: ", action.payload)
            return {
                ...state,
                notes: action.payload
            }

        case ActionTypes.SORT:
            switch (action.payload) {
                case SortType.SORT_BY_VOTES:
                    return {
                        ...state,
                        notes: sortByVotes(state.notes)
                    }
                case SortType.SORT_BY_TIMESTAMP:
                    return {
                        // TODO: sort notes by timestamp
                        ...state
                    }
                default:
                    return state
            }

        case ActionTypes.REFRESH_WALLS:
            return {
                ...state,
                retroWalls: action.payload,
                notes: new Notes([])
            }


    }
    return initialState
}