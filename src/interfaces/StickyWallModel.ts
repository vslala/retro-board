import {StickyNoteStyle} from "./StickyNoteModel";
import RetroWall from "../models/RetroWall";

export interface WallStyle {
    stickyNote: StickyNoteStyle
}

export interface StickyWallModel {
    retroWall: RetroWall
}