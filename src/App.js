import React, { useState, useContext } from 'react';
import './App.css';
import AuthProvider, {UserContext, auth} from "./AuthProvider"
import {AddCardComponent} from "./AddCard"
import {ShowNotifications} from "./NotificationContextProvider"
import ReviewComponent from "./ReviewComponent"
import CardManager from "./CardManager"
import GraduatedCards from "./GraduatedCards"
import {initFirebase} from "./Utils";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

initFirebase();

function App() {
    return (
        <AuthProvider>
            <Application/>
        </AuthProvider>
    );
}

function Application() {
    const [showNotifications, setShowNotifications] = useState(true);
    const user = useContext(UserContext);

    return (
    <ShowNotifications.Provider value={{showNotifications, setShowNotifications}}>
        <div className="App">
            <h1 style={{textAlign:"center"}}>Short Term Memorization App</h1>

            <section>
            {user ? <Memorization /> : <SignIn />}
          </section>
        </div>
    </ShowNotifications.Provider>
    );
}

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    return (
        <div style={{textAlign:"center"}}>
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ToggleNotifications() {
    const {showNotifications, setShowNotifications} = useContext(ShowNotifications);
    return (
    <button onClick={() => setShowNotifications(!showNotifications)}>toggle notifications:{showNotifications ? "on" : "off"}</button>
    )
}

function Memorization(){

    return (
    <div className="grid-container">
        <div className="addCard">
            <AddCardComponent/>
        </div>
        <div className="review">
            <ReviewComponent/>
        </div>
        <div className="cardManager">
            <ToggleNotifications/>
            <SignOut/>
            <CardManager/>
            <GraduatedCards/>
        </div>
    </div>
    )
}

export default App;
