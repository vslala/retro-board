import {RetroBoardModel, Wall} from "../../interfaces/RetroBoardModel";
import StickyNote from "../../components/StickyNote";
import * as React from "react";
import {WallStyle} from "../../interfaces/StickyWallModel";

class RetroWall implements Wall {
    notes: StickyNote[]
    title: string
    style: WallStyle

    constructor(title: string, notes: StickyNote[], style: WallStyle) {
        this.notes = notes
        this.title = title
        this.style = style
    }
}

class RetroBoardData implements RetroBoardModel {
    data: RetroWall[]

    constructor(retroWalls: RetroWall[]) {
        this.data = retroWalls
    }
}

class RetroBoardService {
    getData(): RetroBoardModel {
        return new RetroBoardData(testData)
    }
}

const testData = [
    // @ts-ignore
    new RetroWall("What went well", [<StickyNote noteText={"Foo"} />], {stickyNote: {
        backgroundColor: "#009688",
        textColor: "white",
        likeBtnPosition: "right"
    }}),
    // @ts-ignore
    new RetroWall("Things to improve", [<StickyNote noteText={"Bar"} />], {stickyNote: {
        backgroundColor: "#e91e63",
        textColor: "white",
        likeBtnPosition: "right"
    }}),
    // @ts-ignore
    new RetroWall("Action Items", [<StickyNote noteText={"FooBar"} />], {stickyNote: {
        backgroundColor: "#9c27b0",
        textColor: "white",
        likeBtnPosition: "right"
    }})
]

export default RetroBoardService