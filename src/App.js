import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import './App.css';

import alert from './done-for-you-612.mp3';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

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
import { v4 as uuidv4 } from 'uuid';

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

const ShowNotifications = createContext(null);

function App() {
    const [showNotifications, setShowNotifications] = useState(true);
    const [user] = useAuthState(auth);

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
            <AddCard/>
        </div>
        <div className="review">
            <Review/>
        </div>
        <div className="cardManager">
            <ToggleNotifications/>
            <SignOut/>
            <CardManager/>
            <Graduated/>
        </div>
    </div>
    )
}

const addCard = async (front, back, image, showOnQuestion) => {
    const query = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');

    const revDate = new Date();
    revDate.setSeconds(revDate.getSeconds()+ 5);
    const id = uuidv4();

    if(image) {
        storage.ref(`/${auth.currentUser.uid}/${id}`).put(image, {contentType: 'image/jpg'});
        await query.add({front, back, image: id, showOnQuestion, state:0, reviewDate:revDate});
    }else {
        await query.add({front, back, showOnQuestion, state:0, reviewDate:revDate});
    }
};

function AddCard(){
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [imageURL, setImageUrl] = useState('');
    const [image, setImage] = useState(null);
    const [showOnQuestion, setShowOnQuestion] = useState(false);

    const onAddCard = (e) => {
        e.preventDefault();
        addCard(front, back, image, showOnQuestion);

        setFront('');
        setBack('');
        setImage(null);
        setImageUrl('');
        setShowOnQuestion(false);
    };

    return (
        <div className={"centerContents"}>
            <form onSubmit={onAddCard} style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap", width: "75%"}}>
                <label htmlFor="front"><b>Front</b></label>
                <textarea placeholder="Enter Front Side" name="front" id="front" value={front} onChange={(e) => setFront(e.target.value)} />
                <label htmlFor="back"><b>Back</b></label>
                <textarea placeholder="Enter Back Side" name="back" id="back" value={back} onChange={(e) => setBack(e.target.value)} />
                <label htmlFor="image"><b>Image</b></label>
                <input type="file" id="image" onChange={(e) => {
                    setImage(e.target.files[0]);
                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                }}/>
                <img src={imageURL} alt={"preview"}/>
                <div onChange={(e) => e.target.value === "Question" ? setShowOnQuestion(true) : setShowOnQuestion(false)}>
                    <input type="radio" value="Question" name="showOnQuestion" /> Show On Question
                    <input type="radio" value="Answer" name="showOnQuestion" /> Show On Answer
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

function Review() {
    const {showNotifications} = useContext(ShowNotifications);

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
        const audio = new Audio(alert);
        const interval = setInterval(() => {
            if (haveReviews && showNotifications) {
                new Notification('Do Reviews');
                audio.play()
            }
        }, 10 * 1000);
        return () => clearInterval(interval);
    }, [haveReviews, showNotifications]);

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

    const [show, setShow] = useState(false);
    const [imgUrl, setImgUrl] = useState("");

    const changeState = useCallback(async (card, state) => {
        const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');

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
    }, []);

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

    if (card.image) {
        storage.ref(`/${auth.currentUser.uid}/${card.image}`).getDownloadURL().then((url) => setImgUrl(url));
    }

    return(<>
        <div>
            {card.showOnQuestion && <img src={imgUrl} alt={"question"}/>}
            <pre style={{textAlign:"center"}}>{card.front}</pre>
            <hr/>
            {show ? <pre style={{textAlign:"center"}}>{card.back}</pre> : <p/>}
        </div>
        {show ?
            <div>
                {imgUrl && !card.showOnQuestion && <img src={imgUrl} alt={"answer"}/>}
                <div className={"centerContents"}>
                    <button onClick = {() => changeState(card, card.state - 1)}>Again</button>
                    <button onClick = {() => changeState(card, card.state + 1)}>Good</button>
                </div>
            </div>
            :
            <button onClick={() => setShow(true)}>Show</button>
        }
    </>)
}

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

function Graduated(){
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path.where("state", "==", 7),{ idField: 'id' });

    const removeCard = async (cardId, cardImage) => {
        if(cardImage) {
            storage.ref(`/${auth.currentUser.uid}/${cardImage}`).delete();
        }
        path.doc(cardId).delete();
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
                    <td><button onClick={() => removeCard(c.id, c.image)}>Remove Card</button></td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
    </div>)
}

function CardManager() {
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });

    const removeCard = async (cardId, cardImage) => {
        if(cardImage) {
            storage.ref(`/${auth.currentUser.uid}/${cardImage}`).delete();
        }
        path.doc(cardId).delete();
    };

    const importJSON = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            let cardsToImport = JSON.parse(e.target.result);
            cardsToImport.forEach(c => addCard(c.front, c.back));
        };
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
                    <td><button onClick={() => removeCard(c.id, c.image)}>X</button></td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
        <label htmlFor="avatar">Import:</label>
        <input type="file" id="avatar" name="import" accept=".json" onChange={importJSON}/>
    </div>)
}

export default App;
