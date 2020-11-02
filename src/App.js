import React, { useState, useEffect } from 'react';
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
                        <Graduated/>
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
    const [curDate, setDate] = useState(new Date());
    curDate.setMilliseconds(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
            curDate.setMilliseconds(0);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else {
        Notification.requestPermission();
    }


    const path = firestore.collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });

    const haveReviews = cards && 0 < cards.filter(c => c.reviewDate.toDate() < new Date() && c.state < 7).length;

    if (haveReviews)
        new Notification('Do Reviews');

    return(<>
        {haveReviews &&
        <div>
            <CardReview card = {cards.filter(c => c.reviewDate.toDate() < new Date())[0]}/>
        </div>
        }
        </>)
}

function CardReview(props) {
    const card = props.card;
    const path = firestore.collection('cards');
    const stateToTime = {
        0: 5,
        1: 25,
        2: 2*60,
        3: 10*60,
        4: 60*60,
        5: 5*60*60,
        6: 24*60*60,
    };

    const [show, setShow] = useState(false);

    const changeState = async (card, state) => {
        if (state < 0)
            state = 0;
        const newReviewDate = new Date();
        newReviewDate.setSeconds(newReviewDate.getSeconds() + stateToTime[state]);
        await path.doc(card.id).set({
            front:card.front,
            back: card.back,
            reviewDate: newReviewDate,
            state: state
        });
    };

    return(<>
        <div>
            <p>{card.front}</p>
            <hr/>
            {show ? <p>{card.back}</p> : <p/>}
        </div>
        {show ?
            <div>
                <button onClick = {() => changeState(card, card.state - 1)}>Again</button>
                <button onClick = {() => changeState(card, card.state + 1)}>Good</button>
            </div>
            :
            <button onClick={() => setShow(true)}>Show</button>
        }
    </>)
}

function Graduated(){
    const path = firestore.collection('cards');
    const [cards] = useCollectionData(path.where("state", "==", 7),{ idField: 'id' });

    const removeCard = async (cardId) => {
        await path.doc(cardId).delete();
    };

    return(<div>
        <h1>Graduated Cards</h1>
        <table>
            <thead>
                <th>Front</th>
                <th>Back</th>
                <th>Remove</th>
            </thead>
            {cards && cards.map(c =>
                <tr key={c.id}>
                    <td>{c.front}</td>
                    <td>{c.back}</td>
                    <td><button onClick={() => removeCard(c.id)}>Remove Card</button></td>
                </tr>)}
        </table>
    </div>)
}

export default App;