import {RouteComponentProps} from "react-router-dom";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";

export interface HomePageModel extends RouteComponentProps {
    linkText?: string
    linkUrl?: string
    retroBoardService: RetroBoardService
}
