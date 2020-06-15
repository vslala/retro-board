import {WallStyle} from "../interfaces/StickyWallModel";
import {StickyNoteStyle} from "../interfaces/StickyNoteModel";

export interface TemplateNote {
    noteText: string
    noteStyle: StickyNoteStyle
}
export interface TemplateWall {
    wallTitle: string
    wallStyle: WallStyle
    wallOrder: number
    notes: Array<TemplateNote>
}
interface BoardTemplate {
    templateId: string | undefined
    templateTitle: string
    walls: Array<TemplateWall>
    userId: string
}

export interface BoardTemplates {
    templates: Array<BoardTemplate>
}

export default BoardTemplate;