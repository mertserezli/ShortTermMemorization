import React, {createContext} from "react";

import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";

export const UserContext = createContext(null);

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDGSAwFYYLloUhAYz3jSTi-bweWk3IPtKo",
        authDomain: "shorttermmemo-dev.firebaseapp.com",
        projectId: "shorttermmemo-dev",
        storageBucket: "shorttermmemo-dev.appspot.com",
        messagingSenderId: "853096818756",
        appId: "1:853096818756:web:b8b3c8aa12fd1703fab411"
    });
}

export const auth = firebase.auth();

export default function UserProvider(props){
    const [user] = useAuthState(auth);

    return(
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}