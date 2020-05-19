import {RetroBoardService} from "./RetroBoardService";
import RetroBoardServiceV2 from "./RetroBoardServiceV2";

class RetroBoardServiceFactory {

    public static getInstance(): RetroBoardService {
        return RetroBoardServiceV2.getInstance();
    }
}

export default RetroBoardServiceFactory;