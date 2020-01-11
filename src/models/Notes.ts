import Note from "./Note";

class Notes {
    get notes(): Note[] {
        return [...this._notes];
    }
    
    private _notes: Note[]
    
    constructor(notes:Note[]) {
        this._notes = notes
    }
    
    public static fromJSON(json:string): Notes {
        console.log("json", json)
        return JSON.parse(json)
    }
    
    public static toJSON(notes: Notes): string {
        return JSON.stringify(notes)
    }
}

export default Notes