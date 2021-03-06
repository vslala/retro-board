class User {
    public static ID_TOKEN = "idToken";
    public static USER_INFO = "userInfo";
    public static REFRESH_TOKEN = "refreshToken";

    public uid: string = ""
    public idToken: string = ""
    public username: string | undefined
    public displayName: string = ""
    public email: string = ""
    public isEmailVerified: boolean = false;
}

export default User