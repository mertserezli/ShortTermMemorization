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

    const removeCard = async (cardId, QImageId, AImageId) => {
        if(QImageId) {
            storage.ref(`/${auth.currentUser.uid}/${QImageId}`).delete();
        }
        if(AImageId) {
            storage.ref(`/${auth.currentUser.uid}/${AImageId}`).delete();
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
                    <td><button onClick={() => removeCard(c.id, c.QImageId, c.AImageId)}>Remove Card</button></td>
                </tr>)}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
    </div>)

}