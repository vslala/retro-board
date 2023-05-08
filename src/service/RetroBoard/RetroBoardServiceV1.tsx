import RetroBoard from "../../models/RetroBoard";
import Firebase from "../Firebase";
import Note from "../../models/Note";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import {RetroBoardService} from "./RetroBoardService";
import {ITeam} from "../../models/Team";
import {push, ref, set, get, onValue, update, child} from "firebase/database";

class RetroBoardServiceV1 implements RetroBoardService {

    public static BOARDS = "/boards"
    public static WALLS = "/walls"
    public static NOTES = "/notes"
    public static RETRO_BOARD_ID = "retroBoardId";
    public static instance: RetroBoardServiceV1

    private constructor() {
    }

    shareBoard(retroBoardId: string, selectedTeams: Array<ITeam>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public static getInstance(): RetroBoardService {
        if (!RetroBoardServiceV1.instance)
            RetroBoardServiceV1.instance = new RetroBoardServiceV1()

        return RetroBoardServiceV1.instance
    }

    async getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard> {
        const db = Firebase.getInstance().getDatabase();
        const snapshot = await get(ref(db, `${RetroBoardServiceV1.BOARDS}/${uid}/${retroBoardId}`));
        const retroBoard = snapshot.val() as RetroBoard;

        console.log("Retro Board: ", retroBoard);
        return retroBoard;
    }

    async getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        const db = Firebase.getInstance().getDatabase();
        const snapshot = await get(ref(db, `${RetroBoardServiceV1.WALLS}/${retroBoardId}`));
        return RetroWalls.fromJSON(snapshot.val());
    }

    public async createNewRetroBoard({
                                         title,
                                         maxLikes,
                                     }: {
        title: string;
        maxLikes: number;
    }) {
        let retroBoardDBPath = this._getRetroBoardDBPath();
        const database = Firebase.getInstance().getDatabase();
        let dbRef = ref(database, retroBoardDBPath);
        push(dbRef);
        const retroBoardId = dbRef.key;

        if (retroBoardId) {
            const loggedInUser = Firebase.getInstance().getLoggedInUser();
            const retroBoard = new RetroBoard(retroBoardId, title, loggedInUser?.uid!);
            retroBoard.maxLikes = maxLikes;
            await set(ref(database, `${retroBoardDBPath}/${retroBoardId}`), retroBoard);
            localStorage.setItem(RetroBoardServiceV1.RETRO_BOARD_ID, retroBoardId);

            return retroBoard;
        }

        throw new Error("Cannot retrieve RetroBoardId from the firebase!");
    }

    private _getRetroBoardDBPath() {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()!

        const retroBoardPath = `${RetroBoardServiceV1.BOARDS}/${loggedInUser.uid}`;
        return retroBoardPath
    }

    async updateRetroBoard(retroBoard: RetroBoard) {
        await update(ref(Firebase.getInstance().getDatabase(), `${this._getRetroBoardDBPath()}/${retroBoard.id}`), retroBoard);
        return retroBoard;
    }

    async createRetroWalls(retroBoardId:string, retroWalls: RetroWalls) {
        const wallsRef = ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.WALLS}/${retroBoardId}`);
        const snapshot = await get(wallsRef);

        if (snapshot.exists()) {
            return RetroWalls.fromJSON(snapshot.val());
        }

        await set(wallsRef, JSON.stringify(retroWalls));
        return retroWalls;
    }

    async addNewNote(newNote: Note) {
        const notesRef = child(ref(Firebase.getInstance().getDatabase(), RetroBoardServiceV1.NOTES), newNote.retroBoardId);
        const newNoteRef = push(notesRef);
        newNote.noteId = newNoteRef.key as string;
        await set(newNoteRef, newNote);
        return newNote;
    }

    async updateNote(modifiedNote: Note) {
        if (!modifiedNote) {
            return modifiedNote;
        }

        update(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}/${modifiedNote.retroBoardId}/${modifiedNote.noteId}`), modifiedNote);
        return modifiedNote;
    }

    async getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (arg0: any) => void) {
        const dbRef = ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.BOARDS}/${uid}/${retroBoardId}`);
        onValue(dbRef, (snapshot) => {
            callback(snapshot.val());
        });
    }

    async getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (arg0: Notes) => void) {
        const notesRef = ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}/${retroBoardId}`);
        onValue(notesRef, (snapshot) => {
            const notes = snapshot.val() ? new Notes(Object.values(snapshot.val())) : new Notes([]);
            callback(notes);
        });
    }

    async getNoteWhenLiked(note: Note, callback: (arg0: any) => void) {
        const noteRef = ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}/${note.retroBoardId}/${note.noteId}`);
        onValue(noteRef, (snapshot) => {
            callback(snapshot.val());
        });
    }


    deleteNote(note: Note): Promise<Note> {
        console.log("Deleting Note: ", note)
        set(child(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}/${note.retroBoardId}`), note.retroBoardId), null);
        return Promise.resolve(note)
    }

    async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let snapshot = await get(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}`));

        console.log(`BoardID: ${retroBoardId}`)
        console.log("Notes:", snapshot.val())
        if (snapshot.val() !== null) {
            return new Notes(Object.values(snapshot.val()))
        }
        return new Notes([])
    }

    async getMyBoards(): Promise<RetroBoard[]> {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            let snapshot = await get(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.BOARDS}/${loggedInUser.uid}`));
            return snapshot.val() ? Object.values(snapshot.val()) : []
        }
        return []
    }

    async deleteBoard(board: RetroBoard): Promise<string> {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            set(child(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.BOARDS}/${board.userId}/${board.id}`), board.id), null);
            set(child(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.WALLS}/${board.id}`), board.id), null);
            set(child(ref(Firebase.getInstance().getDatabase(), `${RetroBoardServiceV1.NOTES}/${board.id}`), board.id), null);
            return board.id
        }
        return ""
    }

    async sortByVotes(notes: Notes) {
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
}

/*

const testData = [
    // @ts-ignore
    new RetroWall("What went well", [<StickyNote noteText={"Foo"}/>], {
        stickyNote: {
            backgroundColor: "#009688",
            textColor: "white",
            likeBtnPosition: "right"
        }
    }),
    // @ts-ignore
    new RetroWall("Things to improve", [<StickyNote noteText={"Bar"}/>], {
        stickyNote: {
            backgroundColor: "#e91e63",
            textColor: "white",
            likeBtnPosition: "right"
        }
    }),
    // @ts-ignore
    new RetroWall("Action Items", [<StickyNote noteText={"FooBar"}/>], {
        stickyNote: {
            backgroundColor: "#9c27b0",
            textColor: "white",
            likeBtnPosition: "right"
        }
    })
]
*/

export default RetroBoardServiceV1
