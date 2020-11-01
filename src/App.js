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

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <main style={{grow: 1, display: "flex", flexDirection: "row"}}>
                    <aside style={{width: "25%"}}>
                        <AddCard/>
                    </aside>
                    <article style={{flexGrow: "1"}}>
                        <Review/>
                    </article>
                    <nav style={{width: "20%"}}>

                    </nav>
                </main>
            </div>
    </>
    )
}

function AddCard(){
    const query = firestore.collection('cards');

    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const addCard = async (e) => {
        e.preventDefault();
        const revDate = new Date();
        revDate.setSeconds(revDate.getSeconds()+ 5);
        await query.add({front:front, back:back, state:0, reviewDate:new Date()});

        setFront('');
        setBack('');
    };

    return (
        <>
            <form>
                <label htmlFor="front"><b>Front</b></label>
                <input type="text" placeholder="Enter Front Side" name="front" id="front" onChange={(e) => setFront(e.target.value)} required/>
                <label htmlFor="back"><b>Back</b></label>
                <input type="text" placeholder="Enter Back Side" name="back" id="back" onChange={(e) => setBack(e.target.value)} required/>
                <button type="submit" onClick={addCard}>Add</button>
            </form>
        </>
    )
}

function Review() {
    const curDate = new Date();
    curDate.setMilliseconds(0);
    const query = firestore.collection('cards').limit(1).where("reviewDate", "<", curDate);

    const [cards] = useCollectionData(query,{ idField: 'id' });

    console.log(cards, curDate.getSeconds());

    return(<>
        {cards && cards.map(card => <CardReview card={card}/>)}
        </>)
}

function CardReview(props) {
    return(<>
        
    </>)
}

export default App;
