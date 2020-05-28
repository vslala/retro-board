import React from 'react'
import firebase from "firebase";
import User from "../models/User";
import {getServiceUrl} from "./RetroBoard/RetroBoardService";

export const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

export interface RefreshTokenResponse {
    access_token: string
    expires_in: number
    token_type: string,
    refresh_token: string,
    id_token: string,
    user_id: string,
    project_id: string
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

        if (userCredentials.user) {
            this.loggedInUser = new User()
            this.loggedInUser.displayName = userCredentials.user.displayName || `${generateRandomText(5)}`
            this.loggedInUser.idToken = idToken
            this.loggedInUser.email = userCredentials.user.email || `${generateRandomText(5)}@retro.com`
            this.loggedInUser.uid = userCredentials.user.uid || ""

            localStorage.setItem(User.ID_TOKEN, idToken);
            localStorage.setItem(User.USER_INFO, JSON.stringify(this.loggedInUser))
            localStorage.setItem(User.REFRESH_TOKEN, userCredentials.user.refreshToken)
        }


    }

    public getLoggedInUser(): User | undefined {
        let loggedInUserJson = localStorage.getItem(User.USER_INFO)!;
        if (loggedInUserJson)
            return JSON.parse(loggedInUserJson) as User
    }

    public async isUserAuthenticated(): Promise<boolean> {
        let refreshToken = localStorage.getItem(User.REFRESH_TOKEN);
        let idToken = localStorage.getItem(User.ID_TOKEN);


        if (refreshToken) {
            if (idToken) {
                let response = await fetch(`${getServiceUrl()}/token/verify?id_token=${idToken}`)
                if (200 === response.status) {
                    return true;
                } else {
                    let newIdToken = await fetch(`https://securetoken.googleapis.com/v1/token?key=${config.apiKey}`, {
                        method: "POST",
                        body: JSON.stringify({
                            grant_type: "refresh_token",
                            refresh_token: refreshToken
                        })
                    });
                    let data = (await newIdToken.json()) as RefreshTokenResponse;
                    localStorage.setItem(User.ID_TOKEN, data.id_token);
                    localStorage.setItem(User.REFRESH_TOKEN, data.refresh_token);
                }
            }

            console.log("User is authenticated!");
            return true;
        }

        console.log("User is not authenticated!");
        return false;
    }

    public getIdToken(): string {
        return localStorage.getItem(User.ID_TOKEN)!;
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