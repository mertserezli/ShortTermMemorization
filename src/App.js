import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDCyFHMeMgLltZbqS37Whh5vMlLM2UCllI",
  authDomain: "shorttermmemorization.firebaseapp.com",
  databaseURL: "https://shorttermmemorization.firebaseio.com",
  projectId: "shorttermmemorization",
  storageBucket: "shorttermmemorization.appspot.com",
  messagingSenderId: "440994357739",
  appId: "1:440994357739:web:db860414b9b1b007e479ae",
  measurementId: "G-0KFM767G9X"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
        {user ? <Memorization /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
      <>
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      </>
  )

}

function Memorization(){
    const query = firestore.collection('cards');

    const [cards] = useCollectionData(query,{ idField: 'id' });

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <main style={{grow: 1, display: "flex", flexDirection: "row"}}>
                    <aside style={{width: "25%"}}>

                    </aside>
                    <article style={{flexGrow: "1"}}>
                        {cards && cards.map(card => <div><h2>{card.front}</h2><h2>{card.back}</h2></div>)}
                    </article>
                    <nav style={{width: "20%"}}>

                    </nav>
                </main>
            </div>
    </>
    )
}

export default App;
