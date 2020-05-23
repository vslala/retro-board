import {RetroBoardService, SERVICE_URL} from "./RetroBoardService";
import Note from "../../models/Note";
import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import Firebase from "../Firebase";
import RetroWall from "../../models/RetroWall";
import User from "../../models/User";
import axios from 'axios';

const request = axios.create({
    baseURL: SERVICE_URL
});

request.interceptors.request.use((config) => {
    config.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(User.ID_TOKEN)!}`,
        'Accept': '*/*'
    }
    return config;
})

class RetroBoardServiceV2 implements RetroBoardService {

    private static retroBoardService: RetroBoardService;

    async addNewNote(newNote: Note): Promise<Note> {
        let response = await request.post("/retro-board/walls/notes", newNote);

        if (201 === response.status) {
            // request the new retro-board from the url and return the data
            // let newNoteData = await request.get(response.headers.location!);
            // let note = await newNoteData.data as Note;
            return newNote;
        }

        throw Error("Error creating note in the backend!");
    }

    async createNewRetroBoard({title, maxLikes}: { title: string; maxLikes: number }): Promise<RetroBoard> {
        let loggedInUser = await Firebase.getInstance().isUserAuthenticated();
        if (!loggedInUser) throw Error("Authentication Exception! User is not logged in.");

        let response = await request.post("/retro-board",
            {name: title, maxLikes: maxLikes});

        if (201 === response.status) {
            console.log(response);
            console.log(response.headers.location);
            // request the new retro-board from the url and return the data
            let retroBoardResponse = await request.get(response.headers.location!);
            let retroBoard = await retroBoardResponse.data as RetroBoard;
            return retroBoard;
        }

        throw Error("Error creating RetroBoard in the backend!");
    }

    async createRetroWalls(retroBoardId: string): Promise<any | RetroWalls> {
        try {
            let retroWallsResponse = await request.get(`/retro-board/walls/${retroBoardId}`);
            if (retroWallsResponse.status === 200)
                return await retroWallsResponse.data as RetroWalls;
        } catch (e) {
            console.log("Creating Retro Walls!");
            // it should create three walls for the given retro board
            let retroWalls = new RetroWalls([
                RetroWall.newInstance(retroBoardId, "Went Well", RETRO_BOARD_STYLES.wentWell, RetroBoardServiceV2.getInstance()),
                RetroWall.newInstance(retroBoardId, "To Improve", RETRO_BOARD_STYLES.toImprove, RetroBoardServiceV2.getInstance()),
                RetroWall.newInstance(retroBoardId, "Action Items", RETRO_BOARD_STYLES.actionItems, RetroBoardServiceV2.getInstance()),
            ]);
            retroWalls.retroBoardId = retroBoardId;

            let response = await request.post(`/retro-board/walls`, retroWalls);

            if (201 === response.status) {
                // it should return the url for walls
                let retroWallsResponse = await request.get(response.headers.location!);
                return await retroWallsResponse.data as RetroWall;
            }
        }

    }

    async deleteBoard(board: RetroBoard): Promise<string> {
        // it should cascade delete board, walls and notes
        let response = await request.delete(`${SERVICE_URL}/retro-board/${board.id}`);
        if (204 === response.status)
            return board.id;

        throw Error("Error deleting retro board in the backend!");
    }

    async deleteNote(note: Note): Promise<Note> {
        // it should delete the individual note by id
        let response = await request.delete(`/retro-board/note/${note.noteId}`);
        if (204 === response.status) return note;

        throw Error("Error deleting note at the backend!");
    }

    async getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void> {
        let response = await request.get(`/retro-board/walls/notes`, {
            params: {
                retroBoardId: retroBoardId,
                wallId: retroWallId,
            }
        });

        callback(await response.data as Notes);
    }


    async getMyBoards(): Promise<RetroBoard[]> {
        let isAuth = await Firebase.getInstance().isUserAuthenticated();
        console.log("IsUserAuthenticated: " + isAuth);
        if (isAuth) {
            let response = await request.get("/retro-board");
            if (200 === response.status)
                return await response.data as RetroBoard[];
        }

        throw Error("Error encountered while fetching boards for the user");
    }

    getNoteWhenLiked(note: Note, callback: (note: Note) => void): Promise<void> {
        // TODO: Requires implementation
        return Promise.resolve();
    }


    async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let response = await request.get(`/retro-board/walls/notes/${retroBoardId}`);
        if (200 === response.status) {
            let notesData = await response.data as Notes;
            return notesData;
        }
        throw Error(`Encountered Error while trying to fetch notes for ${retroBoardId} > ${wallId}`);
    }

    async getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard> {
        let response = await request.get(`/retro-board/${retroBoardId}`);
        if (200 === response.status) {
            let retroBoard = await response.data as RetroBoard;
            return retroBoard;
        }

        throw Error("Error encountered while fetching retro board from the server");
    }

    async getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void> {
        let retroBoard = await this.getRetroBoardById("", retroBoardId);
        callback(retroBoard);
        // throw "Requires Implementation";
    }

    async getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        let response = await request.get(`/retro-board/walls/${retroBoardId}`);
        if (200 === response.status) {
            let retroWalls = await response.data as RetroWalls;
            return retroWalls;
        }

        throw Error(`Error encountered while fetching retro walls for retro board (${retroBoardId})`);
    }

    async sortByVotes(notes: Notes): Promise<Notes> {
        let sortedByVotes = notes.notes.sort((obj1, obj2) => obj1.likedBy.length - obj2.likedBy.length);
        return new Notes(sortedByVotes);
    }

    async updateNote(modifiedNote: Note): Promise<Note> {
        let response = await request.put("/retro-board/note", Note.toJSON(modifiedNote));
        if (204 === response.status) return modifiedNote;

        throw Error("Error encountered while updating note in the backend.");
    }

    async updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard> {
        let response = await request.put("/retro-board", RetroBoard.toJSON(retroBoard));
        if (204 === response.status) return retroBoard;

        throw Error("Error encountered while updating note in the backend.");
    }

    static getInstance() {
        if (!this.retroBoardService)
            this.retroBoardService = new RetroBoardServiceV2();
        return this.retroBoardService;
    }
}

export default RetroBoardServiceV2;