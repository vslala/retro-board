import RetroWall from "./RetroWall";

class RetroWalls {
    retroBoardId: string = ""
    walls: RetroWall[]
    
    constructor(retroWalls: RetroWall[]) {
        this.walls = retroWalls
    }
    
    public static toJSON(retroWalls:RetroWalls) {
        return JSON.stringify(retroWalls)
    }
    
    public static fromJSON(json:string): RetroWalls {
        return JSON.parse(json)
    }
}

export default RetroWalls