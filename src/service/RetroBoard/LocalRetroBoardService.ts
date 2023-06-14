import {RetroBoardService} from "./RetroBoardService";
import Note from "../../models/Note";
import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import retroBoard from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import Notes from "../../models/Notes";
import {ITeam} from "../../models/Team";
import {eventBus, EventRegistry} from "../../common";

class LocalRetroBoardService implements RetroBoardService {
    private readonly _boards_key = "boards";
    private readonly _notes_key = "notes";
    private readonly _walls_key = "walls";

    constructor() {
        if (localStorage.getItem(this._boards_key) === undefined || localStorage.getItem(this._boards_key) === null) {
            localStorage.setItem(this._boards_key, "[]");
            localStorage.setItem(this._notes_key, "[]");
        }
    }


    createNewRetroBoard({title, maxLikes}: { title: string; maxLikes: number }): Promise<RetroBoard> {
        let retroBoards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;
        let newBoard:RetroBoard = new RetroBoard(new Date().getMilliseconds().toString(), title, 'userid');
        retroBoards.push(newBoard);
        localStorage.setItem(this._boards_key, JSON.stringify(retroBoards));

        return Promise.resolve(newBoard);
    }

    addNewNote(newNote: Note): Promise<Note> {
        let notesData = localStorage.getItem(this._notes_key) || "[]";
        if (notesData) {
            let notes = JSON.parse(notesData) as Array<Note>;
            notes.push(newNote);
            localStorage.setItem(this._notes_key, JSON.stringify(notes));

            return Promise.resolve(newNote);
        } else {
            throw Error("Some problem creating new notes in localstorage");
        }

    }

    createRetroWalls(retroBoardId: string, retroWalls: RetroWalls): Promise<any | RetroWalls> {
        let walls = JSON.parse(localStorage.getItem(this._walls_key)!) as Array<RetroWall> || [];
        console.log(walls);
        let newWalls: Array<RetroWall> = [...walls, ...retroWalls.walls];
        localStorage.setItem(this._walls_key, JSON.stringify(newWalls));

        return Promise.resolve(new RetroWalls(newWalls));
    }

    deleteBoard(board: RetroBoard): Promise<string> {
        let boards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;
        let afterDeletingTheBoard = boards.filter(b => b.id !== board.id)
        localStorage.setItem(this._boards_key, JSON.stringify(afterDeletingTheBoard));

        return Promise.resolve(board.id);
    }

    deleteNote(note: Note): Promise<Note> {
        let notes = JSON.parse(localStorage.getItem(this._notes_key)!) as Array<Note>;
        let afterDeletingTheNote = notes.filter(n => n.noteId !== note.noteId)
        localStorage.setItem(this._notes_key, JSON.stringify(afterDeletingTheNote));

        return Promise.resolve(note);
    }

    getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void> {
        function notesChangeAction(key: string) {
            let notesData = localStorage.getItem(key);
            if (notesData) {
                let notes = JSON.parse(notesData) as Array<Note>;
                callback(new Notes(notes.filter(n => n.retroBoardId === retroBoardId && n.wallId === retroWallId)));
            }
        }
        eventBus.subscribe(EventRegistry.CREATE_NOTE, (newNote: Note) => {
            notesChangeAction(this._notes_key);
        });
        eventBus.subscribe(EventRegistry.UPDATE_NOTE, (newNote: Note) => {
            notesChangeAction(this._notes_key);
        })
        eventBus.subscribe(EventRegistry.DELETE_NOTE, (deleteNote: Note) => {
            notesChangeAction(this._notes_key);
        })

        return Promise.resolve();
    }

    getMyBoards(): Promise<RetroBoard[]> {
        let retroBoards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;

        return Promise.resolve(retroBoards);
    }

    getNoteWhenLiked(note: Note, callback: (note: Note) => void): Promise<void> {
        callback(note);
        return Promise.resolve();
    }

    getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let notesData = localStorage.getItem(this._notes_key);
        if (notesData) {
            let notes = JSON.parse(notesData) as Array<Note>;
            return Promise.resolve(new Notes(notes.filter(n => n.wallId === wallId)));
        } else {
            return Promise.resolve(new Notes([]));
        }
    }

    getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard> {
        let retroBoards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;

        return Promise.resolve(retroBoards.find(rb => rb.id === retroBoardId)!);
    }

    getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void> {
        let retroBoards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;
        callback(retroBoards.find(rb => rb.id === retroBoardId)!);
        return Promise.resolve();
    }

    getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        let walls = JSON.parse(localStorage.getItem(this._walls_key)!) as Array<RetroWall>;

        return Promise.resolve(new RetroWalls(walls.filter(w => w.retroBoardId === retroBoardId)));
    }

    shareBoard(retroBoardId: string, selectedTeams: Array<ITeam>): Promise<boolean> {
        return Promise.resolve(false);
    }

    sortByVotes(notes: Notes): Promise<Notes> {
        let storedNotes = JSON.parse(localStorage.getItem(this._notes_key)!) as Array<Note>;

        return Promise.resolve(new Notes(storedNotes));
    }

    updateNote(modifiedNote: Note): Promise<Note> {
        let notes = JSON.parse(localStorage.getItem(this._notes_key)!) as Array<Note>;
        let newNotes = notes.filter(n => n.noteId !== modifiedNote.noteId);
        newNotes.push(modifiedNote);
        localStorage.setItem(this._notes_key, JSON.stringify(newNotes));

        return Promise.resolve(modifiedNote);
    }

    updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard> {
        let retroBoards = JSON.parse(localStorage.getItem(this._boards_key)!) as Array<RetroBoard>;
        let newRetroBoards = retroBoards.filter(rb => rb.id !== retroBoard.id);
        newRetroBoards.push(retroBoard);
        localStorage.setItem(this._boards_key, JSON.stringify(newRetroBoards));

        return Promise.resolve(retroBoard);
    }
}

export default LocalRetroBoardService;
