import React, { useState, useContext } from 'react';
import {ShowNotifications} from "./NotificationContextProvider"

import {auth} from "./AuthProvider";
import {useCollectionData} from "react-firebase-hooks/firestore";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firestore = firebase.firestore();
const storage = firebase.storage();

let timeout;

export default function ReviewComponent() {
    const {showNotifications} = useContext(ShowNotifications);

    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });
    const [curCard, setCurCard] = useState(null);

    const [show, setShow] = useState(false);
    const [QImgUrl, setQImgUrl] = useState("");
    const [AImgUrl, setAImgUrl] = useState("");

    const changeState = async (card, state) => {

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
        await path.doc(card.id).update({
            reviewDate: newReviewDate,
            state: state
        });

        setCurCard(null);
    };

    function pickCard() {
        clearTimeout(timeout);
        if(cards) {
            const toReview = cards.filter(c => c.reviewDate.toDate() < new Date() && c.state < 7);
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
            }
            else{
                const closest = Math.min(...cards.map(t => t.reviewDate.toDate()));
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
                {QImgUrl && <img src={QImgUrl} alt={"question"}/>}
                <pre style={{textAlign: "center"}}>{curCard.front}</pre>
                <hr/>
                {show ?
                    <>
                        {AImgUrl && <img src={AImgUrl} alt={"answer"}/>}
                        <pre style={{textAlign: "center"}}>{curCard.back}</pre>
                        <div className={"centerContents"}>
                            <button onClick = {() => changeState(curCard, curCard.state - 1)}>Again</button>
                            <button onClick = {() => changeState(curCard, curCard.state + 1)}>Good</button>
                        </div>
                    </>
                    :
                    <button onClick={() => setShow(true)}>Show</button>
                }
            </>
            :
            <h2>No reviews left</h2>
        }
    </>)
}