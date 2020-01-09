import Note from "./Note";

class Notes {
    notes: Note[]
    
    constructor(notes:Note[]) {
        this.notes = notes
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