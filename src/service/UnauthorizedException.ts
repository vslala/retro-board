class UnauthorizedException implements Error {

    status: number|undefined
    message: string;
    name: string;

    constructor(name: string, message:string, status:number) {
        this.name = name;
        this.status = status;
        this.message = message;
    }

}

export default UnauthorizedException;