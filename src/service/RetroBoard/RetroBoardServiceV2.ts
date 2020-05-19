import {RetroBoardService} from "./RetroBoardService";
import Note from "../../models/Note";
import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import Firebase from "../Firebase";
import CreateResponse from "../../models/CreateResponse";
import RetroWall from "../../models/RetroWall";

const serviceUrl = "//:localhost:8082/retro-board"
class RetroBoardServiceV2 implements RetroBoardService {

    private static retroBoardService: RetroBoardService;

    async addNewNote(newNote: Note): Promise<Note> {
        let response = await fetch(`${serviceUrl}/note`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: Note.toJSON(newNote)
        });

        if (201 === response.status) {
            let data = await response.json();
            let createResponse = CreateResponse.fromJSON(data);
            // request the new retro-board from the url and return the data
            let newNoteData = await fetch(createResponse.resourceUrl);
            let note = Note.fromJSON(await newNoteData.json());
            return note;
        }

        throw "Error creating note in the backend!";
    }

    async createNewRetroBoard({title, maxLikes}: { title: string; maxLikes: number }): Promise<RetroBoard> {
        let loggedInUser = Firebase.getInstance().getLoggedInUser();
        if (!loggedInUser) throw "Authentication Exception! User is not logged in.";

        let response = await fetch(`${serviceUrl}/retro-board`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: RetroBoard.toJSON(new RetroBoard("", title, loggedInUser.uid))
        });

        if (201 == response.status) {
            let data = await response.json();
            let createResponse = CreateResponse.fromJSON(data);
            // request the new retro-board from the url and return the data
            let retroBoardData = await fetch(createResponse.resourceUrl);
            let retroBoard = RetroBoard.fromJSON(await retroBoardData.json());
            return retroBoard;
        }

        throw "Error creating RetroBoard in the backend!";
    }

    async createRetroWalls(retroBoardId: string): Promise<any | RetroWalls> {
        // it should create three walls for the given retro board
        let retroWalls = new RetroWalls([
            RetroWall.newInstance(retroBoardId, "Went Well", RETRO_BOARD_STYLES.wentWell, RetroBoardServiceV2.getInstance()),
            RetroWall.newInstance(retroBoardId, "To Improve", RETRO_BOARD_STYLES.toImprove, RetroBoardServiceV2.getInstance()),
            RetroWall.newInstance(retroBoardId, "Action Items", RETRO_BOARD_STYLES.actionItems, RetroBoardServiceV2.getInstance()),
        ]);

        let response = await fetch(`${serviceUrl}/retro-board/walls`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(retroWalls)
        });

        if (201 === response.status) {
            // it should return the url for walls
            let data = CreateResponse.fromJSON(await response.json());
            let retroWallsResponse = await fetch(data.resourceUrl);
            let retroWalls = await (retroWallsResponse).json();
            return RetroWalls.fromJSON(retroWalls);
        }

        throw "Error creating retro walls for the retro board";
    }

    async deleteBoard(board: RetroBoard): Promise<string> {
        // it should cascade delete board, walls and notes
        let response = await fetch(`${serviceUrl}/retro-board/${board.id}`, {
            method: 'DELETE'
        })
        if (204 === response.status)
            return board.id;

        throw "Error deleting retro board in the backend!";
    }

    async deleteNote(note: Note): Promise<Note> {
        // it should delete the individual note by id
        let response = await fetch(`${serviceUrl}/retro-board/note/${note.noteId}`, {
            method: 'DELETE'
        });
        if (204 === response.status) return note;

        throw "Error deleting note at the backend!";
    }

    getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void> {
        throw "Requires Implementation";
    }

    async getMyBoards(): Promise<RetroBoard[]> {
        let response = await fetch(`${serviceUrl}/retro-board`);
        if (200 === response.status)
            return await response.json() as RetroBoard[];

        throw "Error encountered while fetching boards for the user";
    }

    getNoteWhenLiked(note: Note, callback: (note: Note) => void): Promise<void> {
        throw "Requires Implementation";
    }

    async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let response = await fetch(`${serviceUrl}/retro-board/note/${retroBoardId}/${wallId}`);
        if (200 === response.status) {
            let notesData = Notes.fromJSON(await response.json());
            return notesData;
        }
        throw `Encountered Error while trying to fetch notes for ${retroBoardId} > ${wallId}`;
    }

    async getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard> {
        let response = await fetch(`${serviceUrl}/retro-board/${retroBoardId}`);
        if (200 === response.status) {
            let retroBoard = RetroBoard.fromJSON(await response.json());
            return retroBoard;
        }

        throw "Error encountered while fetching retro board from the server";
    }

    getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void> {
        throw "Requires Implementation";
    }

    async getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        let response = await fetch(`${serviceUrl}/retro-board/walls/${retroBoardId}`);
        if (200 === response.status) {
            let retroWalls = RetroWalls.fromJSON(await response.json());
            return retroWalls;
        }

        throw `Error encountered while fetching retro walls for retro board (${retroBoardId})`;
    }

    async sortByVotes(notes: Notes): Promise<Notes> {
        let sortedByVotes = notes.notes.sort((obj1, obj2) => obj1.likedBy.length - obj2.likedBy.length);
        return new Notes(sortedByVotes);
    }

    async updateNote(modifiedNote: Note): Promise<Note> {
        let response = await fetch(`${serviceUrl}/retro-board/note`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: Note.toJSON(modifiedNote)
        });
        if (204 == response.status) return modifiedNote;

        throw "Error encountered while updating note in the backend.";
    }

    async updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard> {
        let response = await fetch(`${serviceUrl}/retro-board`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: RetroBoard.toJSON(retroBoard)
        });
        if (204 == response.status) return retroBoard;

        throw "Error encountered while updating note in the backend.";
    }

    static getInstance() {
        if (!this.retroBoardService)
            this.retroBoardService = new RetroBoardServiceV2();
        return this.retroBoardService;
    }
}

export default RetroBoardServiceV2;