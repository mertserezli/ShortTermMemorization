import React from 'react';

import { exportToJson } from "./Utils";
import { auth } from "./AuthProvider";
import {useCollection} from "react-firebase-hooks/firestore";
import { addCard } from "./AddCard";

import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

export default function CardManager() {
    const path = collection(firestore, "allCards", auth.currentUser.uid, "cards");

    const [cards] = useCollection(path);

    const removeCard = async (card) => {
        if (card.QImageId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.QImageId}`));
        }
        if (card.AImageId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.AImageId}`));
        }
        if (card.QAudioId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.QAudioId}`));
        }
        if (card.AAudioId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.AAudioId}`));
        }
        await deleteDoc(doc(path, card.id));
    };

    const importJSON = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            let cardsToImport = JSON.parse(e.target.result);
            cardsToImport.forEach(c => addCard(c.front, c.back));
        };
    };

    return (
      <div>
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
              {cards && cards.docs.map(c =>
                <tr key={c.id}>
                    <td>{c.data().front}</td>
                    <td>{c.data().state}</td>
                    <td>{c.data().reviewDate.toDate().toLocaleString()}</td>
                    <td><button onClick={() => removeCard(c)}>X</button></td>
                </tr>
              )}
              </tbody>
          </table>
          <button onClick={() => exportToJson(cards)}>
              Export
          </button>
          <label htmlFor="avatar">Import:</label>
          <input
            type="file"
            id="avatar"
            name="import"
            accept=".json"
            onChange={importJSON}
          />
      </div>
    );
}