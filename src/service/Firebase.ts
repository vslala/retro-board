import React from 'react'
import {Auth, getAuth, GoogleAuthProvider, signInAnonymously, signInWithPopup, UserCredential} from 'firebase/auth';
import {Database, getDatabase} from 'firebase/database';
import {FirebaseApp, initializeApp} from 'firebase/app';
import User from "../models/User";
import {request, SERVICE_URL} from "../env-config";

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

    private auth: Auth
    private authenticatedUser: UserCredential | undefined;
    private googleAuthenticationProvider = new GoogleAuthProvider()
    private loggedInUser: User | undefined
    private app: FirebaseApp;

    private constructor() {
        this.app = initializeApp(config)
        this.auth = getAuth(this.app);
    }

    public static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }

        return Firebase.instance;
    }

    public getDatabase(): Database {
        return getDatabase(this.app);
    }

    public async authenticateUser(): Promise<void> {
        let userCredentials: UserCredential = await signInWithPopup(this.auth, this.googleAuthenticationProvider);
        await this.persistLoggedInUserInfo(userCredentials);
    }

    private async persistLoggedInUserInfo(userCredentials: UserCredential) {

        function generateRandomText(length: number) {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
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
            this.loggedInUser.isEmailVerified = !userCredentials.user.isAnonymous;

            let response = await request.post("/login", userCredentials.user);
            if (response.status === 200) {
                localStorage.setItem(User.ID_TOKEN, idToken);
                localStorage.setItem(User.USER_INFO, JSON.stringify(this.loggedInUser))
                localStorage.setItem(User.REFRESH_TOKEN, userCredentials.user.refreshToken)
            }
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
                let response = await fetch(`${SERVICE_URL}/token/verify?id_token=${idToken}`)
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
        let userCredentials = await signInAnonymously(this.auth)
        await this.persistLoggedInUserInfo(userCredentials)
    }

    logout() {
        localStorage.clear()
    }
}


export default Firebase
