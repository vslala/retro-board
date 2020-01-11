import RetroBoard from "../../models/RetroBoard";
import RetroWalls from "../../models/RetroWalls";
import Notes from "../../models/Notes";

interface RetroBoardState {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    notes: Notes
}

export default RetroBoardState