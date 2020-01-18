import Note from "./Note";

class Notes {
    get notes(): Note[] {
        return [...this._notes];
    }
    
    private readonly _notes: Note[]
    
    constructor(notes:Note[]) {
        this._notes = this._removeDuplicates(notes)
    }
    
    public static fromJSON(json:string): Notes {
        
        return JSON.parse(json)
    }
    
    public static toJSON(notes: Notes): string {
        return JSON.stringify(notes)
    }
    
    private _removeDuplicates(notes: Note[]) {
        let arr: Note[] = []
        notes.forEach((note, index) => {
            let itemIndex = arr.findIndex((item) => item.noteId === note.noteId)
            if (itemIndex === -1)
                arr.push(note)
        })
        return arr
    }

}

export default Notes