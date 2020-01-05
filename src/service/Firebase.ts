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

    private constructor() {
        firebase.initializeApp(config)
        this.auth = firebase.auth()
      
        console.log(config)
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
      this.authenticatedUser = userCredentials
      let idToken = await userCredentials.user!.getIdToken()
      
      let loggedInUser = new User()
      loggedInUser.displayName = userCredentials.user?.displayName || ""
      loggedInUser.idToken = idToken
      
      localStorage.setItem("idToken", idToken)
      localStorage.setItem(User.USER_INFO, JSON.stringify(loggedInUser))
    }
    
    public isUserAuthenticated() {
      let isAuthenticated =  localStorage.getItem(User.ID_TOKEN) !== null
      console.log("Is Authenticated=", isAuthenticated)
      return isAuthenticated
    }
    
    public getIdToken(): string {
      return this.authenticatedUser!.credential!.providerId
    }
}


export default Firebase