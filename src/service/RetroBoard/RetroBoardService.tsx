import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import Firebase from "../Firebase";
import Note from "../../models/Note";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";

class RetroBoardService {

    public static BOARDS = "/boards/"
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

    public async getRetroBoardById(retroBoardId: string): Promise<RetroBoard> {
        console.log("Retro Board ID: ", retroBoardId)
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(RetroBoardService.BOARDS + retroBoardId).once('value')
        let retroBoard = JSON.parse(snapshot.val()) as RetroBoard

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
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.BOARDS}`).push()
        let retroBoardId = ref.key

        if (retroBoardId) {
            const retroBoard = new RetroBoard(retroBoardId, title);
            retroBoard.maxLikes = maxLikes
            await Firebase.getInstance().getDatabase()
                .ref(RetroBoardService.BOARDS + retroBoardId)
                .set(retroBoard)
            localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId)
            
            return retroBoard
        }

        throw new Error("Cannot retrieve RetroBoardId from the firebase!")
    }

    public async createRetroWalls(retroBoardId: string) {
        let retroWalls = await this._getData(`${RetroBoardService.WALLS}/${retroBoardId}`)
        if (retroWalls) {
            console.log(retroWalls)
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
        console.log("Adding new note...")

        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${newNote.retroBoardId}/${newNote.wallId}`)
            .push()
        newNote.noteId = String(snapshot.key)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${newNote.retroBoardId}/${newNote.wallId}/${newNote.noteId}`)
            .set(newNote)
        return newNote
    }

    public async updateNote(modifiedNote: Note) {
        if (!modifiedNote)
            return modifiedNote
            
        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${modifiedNote.retroBoardId}/${modifiedNote.wallId}/${modifiedNote.noteId}`)
            .update(modifiedNote)
        return modifiedNote
    }

    public async getDataOnUpdate(retroBoardId: string, retroWallId: string, callback: (notes: Notes) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${retroBoardId}/${retroWallId}`)
        ref.on('value', (snapshot) => {
            callback(snapshot.val() ? new Notes(Object.values(snapshot.val())) : new Notes([]))
        })
    }

    public async getNoteWhenLiked(note: Note, callback: (note: Note) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${note.retroBoardId}/${note.wallId}/${note.noteId}`)
        ref.on('value', (snapshot) => {
            console.log("Note Data Changed!", snapshot.val())
            callback(snapshot.val() as Note)
        })
    }


    public deleteNote(note: Note) {
        console.log("Deleting note: ", note)
        Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${note.retroBoardId}/${note.wallId}/${note.noteId}`)
            .remove()
        return note
    }

    public async getNotes(retroBoardId: string, wallId: string): Promise<Notes> {
        let snapshot = await Firebase.getInstance().getDatabase().ref(`${RetroBoardService.NOTES}/${retroBoardId}/${wallId}`)
            .once('value')

        if (snapshot.val() !== null) {
            return new Notes(Object.values(snapshot.val()))
        }
        return new Notes([])
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