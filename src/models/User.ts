class User {
    public static ID_TOKEN = "idToken"
    public static USER_INFO = "userInfo"
    
    public idToken: string = ""
    public username: string | undefined
    public displayName: string = ""
    public email: string = ""
}

export default User