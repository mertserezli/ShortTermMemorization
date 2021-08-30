import React from 'react';

import {exportToJson} from "./Utils"

import {auth} from "./AuthProvider";
import {useCollectionData} from "react-firebase-hooks/firestore";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firestore = firebase.firestore();
const storage = firebase.storage();

export default function GraduatedCards(){
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path.where("state", "==", 7),{ idField: 'id' });

    const removeCard = async (card) => {
        if(card.QImageId) {
            storage.ref(`/${auth.currentUser.uid}/${card.QImageId}`).delete();
        }
        if(card.AImageId) {
            storage.ref(`/${auth.currentUser.uid}/${card.AImageId}`).delete();
        }

        if(card.QAudioId) {
            storage.ref(`/${auth.currentUser.uid}/${card.QImageId}`).delete();
        }
        if(card.AAudioId) {
            storage.ref(`/${auth.currentUser.uid}/${card.AImageId}`).delete();
        }

        path.doc(card.id).delete();
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
                    <td><button onClick={() => removeCard(c)}>Remove Card</button></td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
    </div>)

}