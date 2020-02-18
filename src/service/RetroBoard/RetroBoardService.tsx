import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import Firebase from "../Firebase";
import Note from "../../models/Note";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";

class RetroBoardService {

    public static BOARDS = "/boards"
    public static WALLS = "/walls"
    public static NOTES = "/notes"
    public static RETRO_BOARD_ID = "retroBoardId";
    public static instance: RetroBoardService

    private constructor() {
    }

    public static getInstance(): RetroBoardService {
        if (!RetroBoardService.instance)
            RetroBoardService.instance = new RetroBoardService()

        return RetroBoardService.instance
    }

    private async _getData(dbPath: string) {
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(dbPath).once('value')

        return snapshot.val()
    }

    public async getRetroBoardById(uid:string, retroBoardId: string): Promise<RetroBoard> {

        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardService.BOARDS}/${uid}/${retroBoardId}`).once('value')
        let retroBoard = snapshot.val() as RetroBoard
        
        console.log("Retro Board: ", retroBoard)
        return retroBoard
    }

    public async getRetroWalls(retroBoardId: string): Promise<RetroWalls> {
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardService.WALLS}/${retroBoardId}`)
            .once('value')
        return RetroWalls.fromJSON(snapshot.val())
    }

    public async createNewRetroBoard({title, maxLikes}:
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
            localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId)

            return retroBoard
        }

        throw new Error("Cannot retrieve RetroBoardId from the firebase!")
    }
    
    public async updateRetroBoard(retroBoard:RetroBoard): Promise<RetroBoard> {
        Firebase.getInstance().getDatabase().ref(`${this._getRetroBoardDBPath()}/${retroBoard.id}`)
            .update(retroBoard)
            
        return retroBoard
    }

    private _getRetroBoardDBPath() {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()!

        const retroBoardPath = `${RetroBoardService.BOARDS}/${loggedInUser.uid}`;
        return retroBoardPath
    }

    public async createRetroWalls(retroBoardId: string) {
        let retroWalls = await this._getData(`${RetroBoardService.WALLS}/${retroBoardId}`)
        if (retroWalls) {

            return RetroWalls.fromJSON(retroWalls)
        }

        retroWalls = new RetroWalls([
            RetroWall.newInstance(retroBoardId, "Went Well", RETRO_BOARD_STYLES.wentWell, RetroBoardService.getInstance()),
            RetroWall.newInstance(retroBoardId, "To Improve", RETRO_BOARD_STYLES.toImprove, RetroBoardService.getInstance()),
            RetroWall.newInstance(retroBoardId, "Action Items", RETRO_BOARD_STYLES.actionItems, RetroBoardService.getInstance()),
        ])

        Firebase.getInstance().getDatabase()
            .ref(`${RetroBoardService.WALLS}/${retroBoardId}`)
            .set(JSON.stringify(retroWalls))

        return retroWalls
    }

    public async addNewNote(newNote: Note) {
        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}`).child(newNote.retroBoardId)
            .push()
        newNote.noteId = String(snapshot.key)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}`)
            .child(newNote.retroBoardId)
            .child(newNote.noteId)
            .set(newNote)

        return newNote
    }

    public async updateNote(modifiedNote: Note) {
        if (!modifiedNote)
            return modifiedNote

        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${modifiedNote.retroBoardId}/${modifiedNote.noteId}`)
            .update(modifiedNote)
        return modifiedNote
    }
    
    public async getRetroBoardDataOnUpdate(uid: string, retroBoardId: string, callback: (retroBoard: RetroBoard) => void) {
        console.log(`uid: ${uid}, retroBoardId: ${retroBoardId}`);
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.BOARDS}/${uid}`).child(retroBoardId)
        ref.on('value', (snapshot) => {
            console.log("Retro Board changed!")
            callback(snapshot.val() as RetroBoard)
        })
    }

    public async getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}`).child(retroBoardId)
        ref.on('value', (snapshot) => {
            callback(snapshot.val() ? new Notes(Object.values(snapshot.val())) : new Notes([]))
        })
    }

    public async getNoteWhenLiked(note: Note, callback: (note: Note) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${note.retroBoardId}/${note.noteId}`)
        ref.on('value', (snapshot) => {

            callback(snapshot.val() as Note)
        })
    }


    public deleteNote(note: Note) {
        console.log("Deleting Note: ", note)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}`)
            .child(note.retroBoardId).child(note.noteId)
            .remove()
        return note
    }

    public async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}`)
            .child(retroBoardId)
            .once('value')

        console.log(`BoardID: ${retroBoardId}`)
        console.log("Notes:", snapshot.val())
        if (snapshot.val() !== null) {
            return new Notes(Object.values(snapshot.val()))
        }
        return new Notes([])
    }

    public async getMyBoards(): Promise<RetroBoard[]> {
        let snapshot
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.BOARDS}/${loggedInUser.uid}`)
                .once('value')
            return snapshot.val() ? Object.values(snapshot.val()) : []
        }
        return []
    }

    public async sortByVotes(notes: Notes) {
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

    public async deleteBoard(board: RetroBoard): Promise<string> {
        let loggedInUser = Firebase.getInstance().getLoggedInUser()
        if (loggedInUser) {
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.BOARDS}/${board.userId}`).remove()
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.WALLS}/${board.id}`).remove()
            await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${board.id}`).remove()
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

export default RetroBoardService