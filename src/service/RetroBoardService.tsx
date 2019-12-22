import {RetroBoardModel, Wall} from "../interfaces/RetroBoardModel";
import StickyNote from "../components/StickyNote";
import * as React from "react";

class RetroWall implements Wall {
    notes: StickyNote[]
    title: string

    constructor(title: string, notes: StickyNote[]) {
        this.notes = notes
        this.title = title
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
    new RetroWall("What went well", [<StickyNote noteText={"Foo"} />]),
    // @ts-ignore
    new RetroWall("Things to improve", [<StickyNote noteText={"Bar"} />]),
    // @ts-ignore
    new RetroWall("Action Items", [<StickyNote noteText={"FooBar"} />])
]

export default RetroBoardService