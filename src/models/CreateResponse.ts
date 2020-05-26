class CreateResponse {
    resourceUrl: string = "";

    public static fromJSON(json:string): CreateResponse {
        return JSON.parse(json) as CreateResponse;
    }
}

export default CreateResponse;