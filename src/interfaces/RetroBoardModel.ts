import StickyNote from "../components/StickyNote";

export interface RetroBoardModel {
    data: Wall[]
}

export interface Wall {
    title: string
    notes: StickyNote[]
}