import {RouteComponentProps} from "react-router-dom";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import TemplateService from "../service/Templates/TemplateService";

export interface HomePageModel extends RouteComponentProps {
    linkText?: string
    linkUrl?: string
    retroBoardService: RetroBoardService
    templateService: TemplateService
}
