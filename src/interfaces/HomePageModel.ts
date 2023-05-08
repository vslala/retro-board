import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import TemplateService from "../service/Templates/TemplateService";

export interface HomePageModel {
    linkText?: string
    linkUrl?: string
    retroBoardService: RetroBoardService
    templateService: TemplateService
}
