import {RetroBoardModel} from "../../interfaces/RetroBoardModel";
import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import Firebase from "../Firebase";
import Note from "../../models/Note";

class RetroBoardService {

    public static DATABASE_PATH = "/boards/"
    public static RETRO_BOARD_ID = "retroBoardId";
    public static instance: RetroBoardService
    
    private constructor() {}
    
    public static getInstance():RetroBoardService {
        if (!RetroBoardService.instance)
            RetroBoardService.instance = new RetroBoardService()
        
        return RetroBoardService.instance
    }

    public async _getRetroBoardById(retroBoardId:string) {
        console.log("Retro Board ID: ", retroBoardId)
        let snapshot = await Firebase.getInstance().getDatabase()
            .ref(RetroBoardService.DATABASE_PATH + retroBoardId).once('value')
        let retroBoard = JSON.parse(snapshot.val()) as RetroBoard

        return retroBoard
    }

    public createNewRetroBoard() {
        let retroBoardId: string = String(Date.now())
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId)

        let retroBoard = new RetroBoard(retroBoardId, [
            RetroWall.newInstance("Went Well", RETRO_BOARD_STYLES.wentWell),
            RetroWall.newInstance("To Improve", RETRO_BOARD_STYLES.toImprove),
            RetroWall.newInstance("Action Items", RETRO_BOARD_STYLES.actionItems),
        ]);

        Firebase.getInstance().getDatabase()
            .ref(RetroBoardService.DATABASE_PATH + retroBoardId)
            .set(JSON.stringify(retroBoard))

        return retroBoardId
    }

    public async addNewNote(retroBoardId: string, retroWallId: string, newNote: Note) {
        let retroBoard = await this._getRetroBoardById(retroBoardId)
        console.log("Retro Board: ", retroBoard)
        let retroWall = retroBoard.retroWalls.find((wall) => wall.wallId === retroWallId)
        
        if (retroWall) 
            retroWall.notes.push(newNote)
        
        Firebase.getInstance().getDatabase().ref(RetroBoardService.DATABASE_PATH + retroBoardId)
            .set(JSON.stringify(retroBoard))
        
        return retroWall
    }

    public async getData(retroBoardId: string): Promise<RetroBoardModel> {
        return this._getRetroBoardById(retroBoardId)
    }
    
    public async getDataOnUpdate(retroBoardId: string, callback: (retroBoard: RetroBoard) => void) {
        let ref = Firebase.getInstance().getDatabase().ref(RetroBoardService.DATABASE_PATH + retroBoardId)
        ref.on('value', (snapshot) => {
                callback(JSON.parse(snapshot.val()) as RetroBoard)
            })
    } 

    public async updateNote(modifiedNote: Note) {
        let retroBoard = await this._getRetroBoardById(modifiedNote.retroBoardId)
        let retroWall = retroBoard.retroWalls.find((wall) => wall.wallId === modifiedNote.wallId)!
        let noteIndex = retroWall.notes.findIndex((note) => note.noteId === modifiedNote.noteId)!
        retroWall.notes[noteIndex] = modifiedNote
         
        Firebase.getInstance().getDatabase().ref(RetroBoardService.DATABASE_PATH + modifiedNote.retroBoardId)
            .set(JSON.stringify(retroBoard))
    }
    
    public async deleteNote(note:Note) {
        let retroBoard = await this._getRetroBoardById(note.retroBoardId)
        let retroWall = retroBoard.retroWalls.find((wall) => wall.wallId === note.wallId)
        if (retroWall) {
            let noteIndex = retroWall.notes.findIndex((n) => n.noteId === note.noteId)
            retroWall.notes.splice(noteIndex, 1)
        }
        
        Firebase.getInstance().getDatabase().ref(RetroBoardService.DATABASE_PATH + note.retroBoardId)
            .set(JSON.stringify(retroBoard))
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