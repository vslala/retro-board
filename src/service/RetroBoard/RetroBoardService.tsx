import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";
import Notes from "../../models/Notes";
import {ITeam} from "../../models/Team";

export interface RetroBoardService {

    getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard>;

    getRetroWalls(retroBoardId: string): Promise<RetroWalls>;

    createNewRetroBoard({title, maxLikes}:
                            { title: string, maxLikes: number }): Promise<RetroBoard>;

    updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard>;

    createRetroWalls(retroBoardId: string, retroWalls: RetroWalls): Promise<any | RetroWalls>;

    addNewNote(newNote: Note): Promise<Note>;

    updateNote(modifiedNote: Note): Promise<Note>;

    getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void>;

    getNotesDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void>;

    getNoteDataWhenModified(note: Note, callback: (note: Note) => void): Promise<void>;

    deleteNote(note: Note): Promise<Note>;

    getNotes(retroBoardId: string, wallId: string): Promise<Notes>;

    getMyBoards(): Promise<RetroBoard[]>;

    sortByVotes(notes: Notes): Promise<Notes>;

    deleteBoard(board: RetroBoard): Promise<string>;

    shareBoard(retroBoardId: string, selectedTeams: Array<ITeam>): Promise<boolean>
}