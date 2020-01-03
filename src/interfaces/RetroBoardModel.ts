import StickyNote from "../components/StickyNote";
import {WallStyle} from "./StickyWallModel";

export interface RetroBoardModel {
    data: Wall[]
}

export interface Wall {
    title: string
    notes: StickyNote[]
    style: WallStyle
}