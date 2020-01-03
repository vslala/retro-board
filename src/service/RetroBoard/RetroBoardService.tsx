import {RetroBoardModel} from "../../interfaces/RetroBoardModel";
import StickyNote from "../../components/StickyNote";
import * as React from "react";
import RetroBoard, {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import Firebase from "../Firebase";

class RetroBoardService {

    public createNewRetroBoard() {
        console.log("Creating New Retro Board!!!")
        let retroBoardId: string = String(Date.now())
        localStorage.setItem("retroBoardId", retroBoardId)

        let retroBoard = new RetroBoard(retroBoardId, [
            RetroWall.newInstance("Went Well", RETRO_BOARD_STYLES.wentWell),
            RetroWall.newInstance("To Improve", RETRO_BOARD_STYLES.toImprove),
            RetroWall.newInstance("Action Items", RETRO_BOARD_STYLES.actionItems),
        ]);

        Firebase.getInstance().getDatabase().ref("/boards/" + retroBoardId).set(JSON.stringify(retroBoard))

        return retroBoardId
    }

    getData(): RetroBoardModel {
        return new RetroBoard("1", testData)
    }
}

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

export default RetroBoardService