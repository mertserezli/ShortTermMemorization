import React, { useState, useEffect, useCallback } from 'react';
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

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function Memorization(){

    return (
        <>
            <div style={{display: "flex", flexDirection: "column"}}>
                <main style={{grow: 1, display: "flex", flexDirection: "row"}}>
                    <aside style={{width: "20%"}}>
                        <AddCard/>
                    </aside>
                    <article style={{flexGrow: "1"}}>
                        <Review/>
                    </article>
                    <nav style={{width: "25%"}}>
                        <SignOut/>
                        <CardManager/>
                        <Graduated/>
                    </nav>
                </main>
            </div>
    </>
    )
}

function AddCard(){
    const query = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');

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
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <form style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap", width: "75%"}}>
                <label htmlFor="front"><b>Front</b></label>
                <textarea placeholder="Enter Front Side" name="front" id="front" value={front} onChange={(e) => setFront(e.target.value)} required/>
                <label htmlFor="back"><b>Back</b></label>
                <textarea placeholder="Enter Back Side" name="back" id="back" value={back} onChange={(e) => setBack(e.target.value)} required/>
                <button type="submit" onClick={addCard}>Add</button>
            </form>
        </div>
    )
}

function Review() {
    const [curDate, setDate] = useState(new Date());
    curDate.setMilliseconds(0);

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else {
        Notification.requestPermission();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
            curDate.setMilliseconds(0);
        }, 5000);
        return () => clearInterval(interval);
    }, [curDate]);

    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });

    const haveReviews = cards && 0 < cards.filter(c => c.reviewDate.toDate() < new Date() && c.state < 7).length;

    useEffect(() => {
        const interval = setInterval(() => {
            if (haveReviews)
                new Notification('Do Reviews');
        }, 10* 1000);
        return () => clearInterval(interval);
    }, [haveReviews]);

    return(<>
        {haveReviews ?
            <div>
                <CardReview card = {cards.filter(c => c.reviewDate.toDate() < new Date() && c.state < 7)[0]}/>
            </div>
        :
            <h2>No reviews left</h2>
        }
        </>)
}

function CardReview(props) {
    const card = props.card;
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');

    const [show, setShow] = useState(false);

    const changeState = useCallback(async (card, state) => {
        const stateToTime = {
            0: 5,
            1: 25,
            2: 2*60,
            3: 10*60,
            4: 60*60,
            5: 5*60*60,
            6: 24*60*60,
            7: 1,
        };

        setShow(false);

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
    }, [path]);

    useEffect(() => {
        const keyPress = (event) => {
            if(event.key === '1' && show){
                changeState(card, card.state - 1)
            }
            else if(event.key === ' '){
                if(show) {
                    changeState(card, card.state + 1)
                } else{
                    setShow(true)
                }
            }
        };

        document.addEventListener("keydown", keyPress, false);

        return () => {
            document.removeEventListener("keydown", keyPress, false);
        };
    }, [card, changeState, show]);

    return(<>
        <div>
            <pre>{card.front}</pre>
            <hr/>
            {show ? <pre>{card.back}</pre> : <p/>}
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
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path.where("state", "==", 7),{ idField: 'id' });

    const removeCard = async (cardId) => {
        await path.doc(cardId).delete();
    };

    return(<div>
        <h1>Graduated Cards</h1>
        <table>
            <thead>
            <tr>
                <th>Front</th>
                <th>Back</th>
                <th>Remove</th>
            </tr>
            </thead>
            <tbody>
            {cards && cards.map(c =>
                <tr key={c.id}>
                    <td>{c.front}</td>
                    <td>{c.back}</td>
                    <td><button onClick={() => removeCard(c.id)}>Remove Card</button></td>
                </tr>)}
            </tbody>
        </table>
    </div>)
}

function CardManager() {
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });

    const removeCard = async (cardId) => {
        await path.doc(cardId).delete();
    };

    const exportToJson = (object)=>{
        let filename = "export.json";
        let contentType = "application/json;charset=utf-8;";
        object = object.map(card =>{ return {front:card.front, back:card.back}});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(object)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return(<div>
        <h1>All Cards</h1>
        <table>
            <thead>
            <tr>
                <th>Front</th>
                <th>State</th>
                <th>Review Date</th>
                <th>Remove</th>
            </tr>
            </thead>
            <tbody>
            {cards && cards.map(c =>
                <tr key={c.id}>
                    <td>{c.front}</td>
                    <td>{c.state}</td>
                    <td>{c.reviewDate.toDate().toLocaleString()}</td>
                    <td><button onClick={() => removeCard(c.id)}>X</button></td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
    </div>)
}

export default App;
