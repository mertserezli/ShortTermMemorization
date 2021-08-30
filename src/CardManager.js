import React from 'react';

import {exportToJson} from "./Utils"

import {auth} from "./AuthProvider";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {addCard} from "./AddCard";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firestore = firebase.firestore();
const storage = firebase.storage();

export default function CardManager() {
    const path = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');
    const [cards] = useCollectionData(path,{ idField: 'id' });

    const removeCard = async (card) => {
        if(card.QImageId) {
            storage.ref(`/${auth.currentUser.uid}/${card.QImageId}`).delete();
        }
        if(card.AImageId) {
            storage.ref(`/${auth.currentUser.uid}/${card.AImageId}`).delete();
        }

        if(card.QAudioId) {
            storage.ref(`/${auth.currentUser.uid}/${card.QAudioId}`).delete();
        }
        if(card.AAudioId) {
            storage.ref(`/${auth.currentUser.uid}/${card.AAudioId}`).delete();
        }

        path.doc(card.id).delete();
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
                    <td><button onClick={() => removeCard(c)}>X</button></td>
                </tr>
            )}
            </tbody>
        </table>
        <button onClick={() => exportToJson(cards)}>
            Export
        </button>
        <label htmlFor="avatar">Import:</label>
        <input type="file" id="avatar" name="import" accept=".json" onChange={importJSON}/>
    </div>)
}