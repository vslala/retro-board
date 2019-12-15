import {RetroBoardModel, Wall} from "../interfaces/RetroBoardModel";

const retroBoardData = {
    "data": [
        {
            "wall": {
                "title": "What went well",
                "notes": [
                    "Foo", "Bar"
                ]
            }
        },
        {
            "wall": {
                "title": "Things to be improved",
                "notes": [
                    "Foo", "Bar"
                ]
            }
        },
        {
            "wall": {
                "title": "Action Items",
                "notes": [
                    "Foo", "Bar"
                ]
            }
        }
    ]
}



class RetroWall implements Wall {
    notes: string[]
    title: string

    constructor(title: string, notes: string[]) {
        this.notes = notes
        this.title = title
    }
}

class RetroBoardData implements RetroBoardModel {
    data: RetroWall[] = []

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
    new RetroWall("What went well", ["Foo"]),
    new RetroWall("Things to improve", ["Bar"]),
    new RetroWall("Action Items", ["FooBar"])
]

export default RetroBoardService