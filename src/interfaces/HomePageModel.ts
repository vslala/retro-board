import {RouteComponentProps} from "react-router-dom";
import RetroBoardServiceV1 from "../service/RetroBoard/RetroBoardServiceV1";

export interface HomePageModel extends RouteComponentProps {
    linkText?: string
    linkUrl?: string
    retroBoardService: RetroBoardServiceV1
}
