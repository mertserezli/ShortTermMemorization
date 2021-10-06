import React, { useState, useContext } from 'react';
import {ShowNotifications} from "./NotificationContextProvider"

import {auth} from "./AuthProvider";
import {useCollectionData} from "react-firebase-hooks/firestore";

import Loading from "./LoadingComponent";
import CountdownTimer from "./CountdownTimer"
import {FirebaseDateToDate} from "./Utils"

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firestore = firebase.firestore();
const storage = firebase.storage();

let timeout;

function getEarliestCard(cards){
    return Math.min(...cards.map(c => FirebaseDateToDate(c.reviewDate)))
}

export default function ReviewComponent() {
    // eslint-disable-next-line no-unused-vars
    const {showNotifications} = useContext(ShowNotifications);

    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });
    const [curCard, setCurCard] = useState(null);
    const [show, setShow] = useState(false);

    const [QImgUrl, setQImgUrl] = useState("");
    const [QImgLoaded, setQImgLoaded] = useState(false);

    const [AImgUrl, setAImgUrl] = useState("");
    const [AImgLoaded, setAImgLoaded] = useState(false);

    const [QAudioUrl, setQAudioUrl] = useState("");
    const [AAudioUrl, setAAudioUrl] = useState("");

    const changeState = async (card, feedback) => {

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

        let newState = card.state;
        card.state = 7;

        if(feedback)
            newState += 1;
        else {
            newState -= 1;
            if (newState < 0)
                newState = 0;
        }

        setShow(false);
        setQImgLoaded(false);
        setAImgLoaded(false);
        setCurCard(null);

        const newReviewDate = new Date();
        newReviewDate.setSeconds(newReviewDate.getSeconds() + stateToTime[newState]);
        card.reviewDate = newReviewDate;
        
        path.doc(card.id).update({
            reviewDate: newReviewDate,
            state: newState
        });

    };

    function pickCard() {
        clearTimeout(timeout);
        if(cards && 0<cards.length) {
            const toReview = cards.filter(c => FirebaseDateToDate(c.reviewDate) < new Date() && c.state < 7);
            if (curCard == null && 0 < toReview.length) {
                setShow(false);
                setCurCard(toReview[0]);

                setQImgUrl("");
                setAImgUrl("");

                if (toReview[0].QImageId) {
                    storage.ref(`/${auth.currentUser.uid}/${toReview[0].QImageId}`).getDownloadURL().then((url) => setQImgUrl(url));
                }

                if (toReview[0].AImageId) {
                    storage.ref(`/${auth.currentUser.uid}/${toReview[0].AImageId}`).getDownloadURL().then((url) => setAImgUrl(url));
                }

                setQAudioUrl("");
                setAAudioUrl("");

                if (toReview[0].QAudioId) {
                    storage.ref(`/${auth.currentUser.uid}/${toReview[0].QAudioId}`).getDownloadURL().then((url) => setQAudioUrl(url));
                }

                if (toReview[0].AAudioId) {
                    storage.ref(`/${auth.currentUser.uid}/${toReview[0].AAudioId}`).getDownloadURL().then((url) => setAAudioUrl(url));
                }
            }
            else{
                const closest = getEarliestCard(cards);
                timeout = setTimeout(() => pickCard(), closest - new Date().getTime() + 500);
            }
        }else{
            timeout = setTimeout(() => pickCard(), 5000);
        }
    }

    pickCard();

    return(<>
        {curCard ?
            <>
                {QImgUrl && <> <Loading show={!QImgLoaded}/> <img style={{display: QImgLoaded ? "block" : "none"}} src={QImgUrl} alt={"question"} onLoad={()=>setQImgLoaded(true)}/> <br/> </>}
                {QAudioUrl &&
                    <audio controls>
                        <source src={QAudioUrl} type="audio/mp3"/>
                        Your browser does not support the audio element.
                    </audio>
                }

                <pre style={{textAlign: "center"}}>{curCard.front}</pre>
                <hr/>
                {show ?
                    <>
                        {AImgUrl && <> <Loading show={!AImgLoaded}/> <img style={{display: AImgLoaded ? "block" : "none"}} src={AImgUrl} alt={"answer"} onLoad={()=>setAImgLoaded(true)}/> <br/> </>}
                        {AAudioUrl &&
                            <audio controls>
                                <source src={AAudioUrl} type="audio/mp3"/>
                                Your browser does not support the audio element.
                            </audio>
                        }
                        <pre style={{textAlign: "center"}}>{curCard.back}</pre>
                        <div>
                            <button onClick = {() => changeState(curCard, false)}>Again</button>
                            <button onClick = {() => changeState(curCard, true)}>Good</button>
                        </div>
                    </>
                    :
                    <button onClick={() => setShow(true)}>Show</button>
                }
            </>
            :
            <>
                {!cards || cards.length === 0 ? <h2>You have no cards. Add some</h2> : <CountdownTimer duration={(getEarliestCard(cards)- new Date().getTime())/1000}/>}
            </>
        }
    </>)
}