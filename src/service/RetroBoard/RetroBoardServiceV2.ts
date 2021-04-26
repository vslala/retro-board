import {RetroBoardService} from "./RetroBoardService";
import Note from "../../models/Note";
import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import Firebase from "../Firebase";
import RetroWall from "../../models/RetroWall";
import DuplexCommunication from "../WebSocket/DuplexCommunication";
import {request} from "../../env-config";
import {Team} from "../../models/Team";
import UnauthorizedException from "../UnauthorizedException";

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

    async createRetroWalls(retroBoardId: string, retroWalls: RetroWalls): Promise<any | RetroWalls> {
        try {
            let retroWallsResponse = await request.get(`/retro-board/walls/${retroBoardId}`);
            if (retroWallsResponse.status === 200)
                return await retroWallsResponse.data as RetroWalls;
        } catch (e) {
            console.log("Creating Retro Walls!");
            // it should create three walls for the given retro board
            // let retroWalls = new RetroWalls([
            //     RetroWall.newInstance(retroBoardId, "Went Well", RETRO_BOARD_STYLES.wentWell, RetroBoardServiceV2.getInstance()).setWallOrder(1),
            //     RetroWall.newInstance(retroBoardId, "To Improve", RETRO_BOARD_STYLES.toImprove, RetroBoardServiceV2.getInstance()).setWallOrder(2),
            //     RetroWall.newInstance(retroBoardId, "Action Items", RETRO_BOARD_STYLES.actionItems, RetroBoardServiceV2.getInstance()).setWallOrder(3),
            // ]);
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
        let response = await request.delete(`/retro-board/${board.id}`);
        if (204 === response.status)
            return board.id;

        throw Error("Error deleting retro board in the backend!");
    }

    async deleteNote(note: Note): Promise<Note> {
        // it should delete the individual note by id
        let response = await request.delete(`/retro-board/walls/notes`, {
            params: {
                noteId: note.noteId,
                retroBoardId: note.retroBoardId
            }
        });
        if (204 === response.status) return note;

        throw Error("Error deleting note at the backend!");
    }

    async getNotesDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void): Promise<void> {
        // This code will only execute whenever a new note is created for the board
        let duplex = DuplexCommunication.getInstance();
        duplex.subscribe(`/topic/notes/${retroBoardId}`, async (uri: string) => {
            let response = await request.get(`/retro-board/walls/notes`, {
                params: {
                    retroBoardId: retroBoardId,
                    wallId: retroWallId,
                }
            });

            callback(await response.data as Notes);
        });

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

    async getNoteDataWhenModified(note: Note, callback: (note: Note) => void): Promise<void> {
        DuplexCommunication.getInstance()
            .subscribe(`/topic/notes/${note.noteId}`, async (uri: any) => {
                console.log("URL:", uri);
                let response = await request.get(`${uri.body}`);
                console.log(response.data);
                callback(await response.data);
            });
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
        } else if (401 === response.status) {
            throw new UnauthorizedException("Unauthorized", "User is not authorized to view the contents of this board.", 401);
        }

        throw Error("Error encountered while fetching retro board from the server");
    }

    async getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void): Promise<void> {
        // This code will only execute whenever a change is made to the retro board
        let duplex = new DuplexCommunication();
        duplex.subscribe(`/topic/retro-board/${retroBoardId}`, async (uri: any) => {
            console.log("URI : ", uri);
            let response = await request.get(uri.body);
            if (response.status === 200) {
                callback(await response.data as RetroBoard);
            }
        });
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
        let response = await request.put("/retro-board/walls/notes", modifiedNote);
        if (204 === response.status) return modifiedNote;

        throw Error("Error encountered while updating note in the backend.");
    }

    async updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard> {
        let response = await request.put("/retro-board", retroBoard);
        if (204 === response.status) return retroBoard;

        throw Error("Error encountered while updating note in the backend.");
    }

    static getInstance() {
        if (!this.retroBoardService)
            this.retroBoardService = new RetroBoardServiceV2();
        return this.retroBoardService;
    }

    async shareBoard(retroBoardId: string, selectedTeams: Array<Team>): Promise<boolean> {
        let response = await request.post("/share", {
            itemId: retroBoardId,
            teamIds: selectedTeams.map(selectedTeam => selectedTeam.teamId)
        });
        if (response.status === 201)
            return true;
        return false;
    }
}

export default RetroBoardServiceV2;