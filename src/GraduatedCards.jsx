import React from 'react';

import { exportToJson } from "./Utils";
import { auth } from "./AuthProvider";
import { useCollectionData } from "react-firebase-hooks/firestore";

import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    deleteDoc
} from "firebase/firestore";
import {
    getStorage,
    ref,
    deleteObject
} from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

export default function GraduatedCards() {
    const cardsRef = collection(doc(collection(firestore, "allCards"), auth.currentUser.uid), "cards");
    const graduatedQuery = query(cardsRef, where("state", "==", 7));

    const [cards] = useCollectionData(graduatedQuery, { idField: "id" });

    const removeCard = async (card) => {
        // Delete associated files from Storage
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

        await deleteDoc(doc(cardsRef, card.id));
    };

    return (
      <div>
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
              {cards && cards.map(c => (
                <tr key={c.id}>
                    <td>{c.front}</td>
                    <td>{c.back}</td>
                    <td>
                        <button onClick={() => removeCard(c)}>Remove Card</button>
                    </td>
                </tr>
              ))}
              </tbody>
          </table>
          <button onClick={() => exportToJson(cards)}>
              Export
          </button>
      </div>
    );
}