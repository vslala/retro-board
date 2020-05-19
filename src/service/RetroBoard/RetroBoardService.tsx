import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Note from "../../models/Note";
import Notes from "../../models/Notes";

export interface RetroBoardService {
    getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard>;

    getRetroWalls(retroBoardId: string): Promise<RetroWalls>;

    createNewRetroBoard({title, maxLikes}:
                            { title: string, maxLikes: number }): Promise<RetroBoard>;

    updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard>;

    createRetroWalls(retroBoardId: string): Promise<any | RetroWalls>;

    addNewNote(newNote: Note): Promise<Note>;

    updateNote(modifiedNote: Note): Promise<Note>;

    getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void>;

    getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void>;

    getNoteWhenLiked(note: Note, callback: (note: Note) => void): Promise<void>;

    deleteNote(note: Note): Promise<Note>;

    getNotes(retroBoardId: string, wallId: string): Promise<Notes>;

    getMyBoards(): Promise<RetroBoard[]>;

    sortByVotes(notes: Notes): Promise<Notes>;

    deleteBoard(board: RetroBoard): Promise<string>;
}