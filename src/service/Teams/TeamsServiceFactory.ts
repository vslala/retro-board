import TeamsServiceV1 from "./TeamsServiceV1";

class TeamsServiceFactory {

    public static getInstance() {
        return TeamsServiceV1.getInstance();
    }
}

export default TeamsServiceFactory;