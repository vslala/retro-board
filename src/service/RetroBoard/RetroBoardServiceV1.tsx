import RetroBoard from "../../models/RetroBoard";
import Firebase from "../Firebase";
import Note from "../../models/Note";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";
import {RetroBoardService} from "./RetroBoardService";
import {ITeam} from "../../models/Team";

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

    private async _getData(dbPath: string) {
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(dbPath).once('value')

        return snapshot.val()
    }

    async getRetroBoardById(uid: string, retroBoardId: string): Promise<RetroBoard> {

        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardServiceV1.BOARDS}/${uid}/${retroBoardId}`).once('value')
        let retroBoard = snapshot.val() as RetroBoard

        console.log("Retro Board: ", retroBoard)
        return retroBoard
    }

    async getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardServiceV1.WALLS}/${retroBoardId}`)
            .once('value')
        return RetroWalls.fromJSON(snapshot.val())
    }

    async createNewRetroBoard({title, maxLikes}:
                                  { title: string, maxLikes: number }) {
        let retroBoardDBPath = this._getRetroBoardDBPath();
        let ref = Firebase.getInstance().getDatabase().ref(retroBoardDBPath).push()
        let retroBoardId = ref.key

        if (retroBoardId) {
            let loggedInUser = Firebase.getInstance().getLoggedInUser()
            const retroBoard = new RetroBoard(retroBoardId, title, loggedInUser?.uid!);
            retroBoard.maxLikes = maxLikes
            await Firebase.getInstance().getDatabase()
                .ref(`${retroBoardDBPath}/${retroBoardId}`)
                .set(retroBoard)
            localStorage.setItem(RetroBoardServiceV1.RETRO_BOARD_ID, retroBoardId)

            return retroBoard
        }

        throw new Error("Cannot retrieve RetroBoardId from the firebase!")
    }

    async updateRetroBoard(retroBoard: RetroBoard): Promise<RetroBoard> {
        Firebase.getInstance().getDatabase().ref(`${this._getRetroBoardDBPath()}/${retroBoard.id}`)
            .update(retroBoard)

        return retroBoard
    }

    private _getRetroBoardDBPath() {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()!

        const retroBoardPath = `${RetroBoardServiceV1.BOARDS}/${loggedInUser.uid}`;
        return retroBoardPath
    }

    async createRetroWalls(retroBoardId: string, retroWalls: RetroWalls) {
        let walls = await this._getData(`${RetroBoardServiceV1.WALLS}/${retroBoardId}`)
        if (walls) {
            return RetroWalls.fromJSON(walls)
        }

        // retroWalls = new RetroWalls([
        //     RetroWall.newInstance(retroBoardId, "Went Well", RETRO_BOARD_STYLES.wentWell, RetroBoardServiceFactory.getInstance()),
        //     RetroWall.newInstance(retroBoardId, "To Improve", RETRO_BOARD_STYLES.toImprove, RetroBoardServiceFactory.getInstance()),
        //     RetroWall.newInstance(retroBoardId, "Action Items", RETRO_BOARD_STYLES.actionItems, RetroBoardServiceFactory.getInstance()),
        // ])

        Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardServiceV1.WALLS}/${retroBoardId}`)
            .set(JSON.stringify(retroWalls))

        return retroWalls
    }

    async addNewNote(newNote: Note) {
        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}`).child(newNote.retroBoardId)
            .push()
        newNote.noteId = String(snapshot.key)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}`)
            .child(newNote.retroBoardId)
            .child(newNote.noteId)
            .set(newNote)

        return newNote
    }

    async updateNote(modifiedNote: Note) {
        if (!modifiedNote)
            return modifiedNote

        Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}/${modifiedNote.retroBoardId}/${modifiedNote.noteId}`)
            .update(modifiedNote)
        return modifiedNote
    }

    async getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void) {
        console.log(`uid: ${uid}, retroBoardId: ${retroBoardId}`);
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.BOARDS}/${uid}`).child(retroBoardId)
        ref.on('value', (snapshot) => {
            console.log("Retro Board changed!")
            callback(snapshot.val() as RetroBoard)
        })
    }

    async getNotesDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}`).child(retroBoardId)
        ref.on('value', (snapshot) => {
            callback(snapshot.val() ? new Notes(Object.values(snapshot.val())) : new Notes([]))
        })
    }

    async getNoteDataWhenModified(note: Note, callback: (note: Note) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}/${note.retroBoardId}/${note.noteId}`)
        ref.on('value', (snapshot) => {

            callback(snapshot.val() as Note)
        })
    }


    deleteNote(note: Note): Promise<Note> {
        console.log("Deleting Note: ", note)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}`)
            .child(note.retroBoardId).child(note.noteId)
            .remove()
        return Promise.resolve(note)
    }

    async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}`)
            .child(retroBoardId)
            .once('value')

        console.log(`BoardID: ${retroBoardId}`)
        console.log("Notes:", snapshot.val())
        if (snapshot.val() !== null) {
            return new Notes(Object.values(snapshot.val()))
        }
        return new Notes([])
    }

    async getMyBoards(): Promise<RetroBoard[]> {
        let snapshot
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.BOARDS}/${loggedInUser.uid}`)
                .once('value')
            return snapshot.val() ? Object.values(snapshot.val()) : []
        }
        return []
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

    async deleteBoard(board: RetroBoard): Promise<string> {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.BOARDS}/${board.userId}/${board.id}`).remove()
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.WALLS}/${board.id}`).remove()
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardServiceV1.NOTES}/${board.id}`).remove()
            return board.id
        }
        return ""
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