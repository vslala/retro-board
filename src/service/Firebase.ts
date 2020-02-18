import React from 'react'
import firebase from "firebase";
import User from "../models/User";

export const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

export const FirebaseContext = React.createContext(null)

class Firebase {

    private static instance: Firebase

    private auth: firebase.auth.Auth
    private authenticatedUser: firebase.auth.UserCredential | undefined;
    private googleAuthenticationProvider = new firebase.auth.GoogleAuthProvider()
    private loggedInUser: User | undefined

    private constructor() {
        firebase.initializeApp(config)
        this.auth = firebase.auth()

        
    }

    public static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }

        return Firebase.instance;
    }

    public getDatabase(): firebase.database.Database {
        return firebase.database()
    }

    public async authenticateUser(): Promise<void> {
        let userCredentials = await this.auth.signInWithPopup(this.googleAuthenticationProvider)
        await this.persistLoggedInUserInfo(userCredentials);
    }

    private async persistLoggedInUserInfo(userCredentials: firebase.auth.UserCredential) {

        function generateRandomText(length: number) {
            let result           = '';
            let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        let idToken = await userCredentials.user!.getIdToken()

        console.log("Logged In User: ", userCredentials)

        this.loggedInUser = new User()
        this.loggedInUser.displayName = userCredentials.user?.displayName || `${generateRandomText(5)}`
        this.loggedInUser.idToken = idToken
        this.loggedInUser.email = userCredentials.user?.email || `${generateRandomText(5)}@retro.com`
        this.loggedInUser.uid = userCredentials.user?.uid || ""

        localStorage.setItem("credentials", JSON.stringify(userCredentials))
        localStorage.setItem("idToken", idToken)
        localStorage.setItem(User.USER_INFO, JSON.stringify(this.loggedInUser))
    }

    public getLoggedInUser(): User | undefined {
        let loggedInUserJson = localStorage.getItem(User.USER_INFO)!;
        if (loggedInUserJson)
            return JSON.parse(loggedInUserJson) as User
    }

    public isUserAuthenticated() {
        let isAuthenticated = localStorage.getItem(User.ID_TOKEN) !== null
        
        return isAuthenticated
    }

    public getIdToken(): string {
        return this.authenticatedUser!.credential!.providerId
    }

    public async authenticateAnonymousUser(): Promise<void> {
        let userCredentials = await this.auth.signInAnonymously()
        await this.persistLoggedInUserInfo(userCredentials)
    }

    logout() {
        localStorage.clear()
    }
}


export default Firebase