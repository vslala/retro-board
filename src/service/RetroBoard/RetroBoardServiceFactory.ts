import {RetroBoardService} from "./RetroBoardService";
import RetroBoardServiceV2 from "./RetroBoardServiceV2";
import LocalRetroBoardService from "./LocalRetroBoardService";

class RetroBoardServiceFactory {

    public static getInstance(): RetroBoardService {
        let env = process.env.NODE_ENV;
        switch (env) {
            case 'development':
                return new LocalRetroBoardService();
            case 'test':
                return RetroBoardServiceV2.getInstance();
            default:
                return RetroBoardServiceV2.getInstance();
        }
    }
}

export default RetroBoardServiceFactory;
