import React, {createContext} from "react";
import {initFirebase} from "./Utils";

import firebase from 'firebase/app';
import 'firebase/auth';
import {useAuthState} from "react-firebase-hooks/auth";

export const UserContext = createContext(null);

initFirebase();

export const auth = firebase.auth();

export default function UserProvider(props){
    const [user] = useAuthState(auth);

    return(
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}