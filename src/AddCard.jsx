import React, { useState, useRef } from 'react';
import { auth } from "./AuthProvider";
import { v4 as uuidv4 } from "uuid";

import {
    getFirestore,
    collection,
    doc,
    addDoc
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes
} from "firebase/storage";

const firestore = getFirestore();
const storage = getStorage();

const addCard = async (front, back, QImage, AImage, QAudio, AAudio) => {
    const cardsRef = collection(doc(collection(firestore, "allCards"), auth.currentUser.uid), "cards");

    const revDate = new Date();
    revDate.setSeconds(revDate.getSeconds() + 5);

    let QImageId = null;
    let AImageId = null;
    let QAudioId = null;
    let AAudioId = null;

    if (QImage) {
        QImageId = uuidv4();
        await uploadBytes(ref(storage, `/${auth.currentUser.uid}/${QImageId}`), QImage, { contentType: 'image/jpg' });
    }
    if (AImage) {
        AImageId = uuidv4();
        await uploadBytes(ref(storage, `/${auth.currentUser.uid}/${AImageId}`), AImage, { contentType: 'image/jpg' });
    }

    if (QAudio) {
        QAudioId = uuidv4();
        await uploadBytes(ref(storage, `/${auth.currentUser.uid}/${QAudioId}`), QAudio, { contentType: 'audio/mp3' });
    }
    if (AAudio) {
        AAudioId = uuidv4(); // ✅ fixed bug: was incorrectly setting AImageId
        await uploadBytes(ref(storage, `/${auth.currentUser.uid}/${AAudioId}`), AAudio, { contentType: 'audio/mp3' });
    }

    await addDoc(cardsRef, {
        front,
        back,
        QImageId,
        AImageId,
        QAudioId,
        AAudioId,
        state: 0,
        reviewDate: revDate
    });
};

function AddCardComponent() {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const [QImageUrl, setQImageUrl] = useState('');
    const [QImage, setQImage] = useState(null);

    const [QAudioUrl, setQAudioUrl] = useState('');
    const [QAudio, setQAudio] = useState(null);

    const [AImageUrl, setAImageUrl] = useState('');
    const [AImage, setAImage] = useState(null);

    const [AAudioUrl, setAAudioUrl] = useState('');
    const [AAudio, setAAudio] = useState(null);

    const QAudioRef = useRef();
    const AAudioRef = useRef();

    const onAddCard = async (e) => {
        e.preventDefault();
        await addCard(front, back, QImage, AImage, QAudio, AAudio);

        setFront('');
        setBack('');

        setQImage(null);
        setQImageUrl('');
        setAImage(null);
        setAImageUrl('');

        setQAudio(null);
        setQAudioUrl('');
        setAAudio(null);
        setAAudioUrl('');
    };

    return (
      <div className="centerContents">
          <form
            onSubmit={onAddCard}
            style={{ grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap", width: "75%" }}
          >
              <label htmlFor="front"><b>Front</b></label>
              <textarea
                placeholder="Enter Front Side"
                name="front"
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
              />

              <label htmlFor="imageQ"><b>Question Image</b></label>
              <input
                type="file"
                id="imageQ"
                onChange={(e) => {
                    setQImage(e.target.files[0]);
                    setQImageUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {QImageUrl && <img src={QImageUrl} alt="question preview" />}

              <label htmlFor="audioQ"><b>Question Sound</b></label>
              <input
                type="file"
                id="audioQ"
                onChange={(e) => {
                    setQAudio(e.target.files[0]);
                    setQAudioUrl(URL.createObjectURL(e.target.files[0]));
                    if (QAudioRef.current) {
                        QAudioRef.current.pause();
                        QAudioRef.current.load();
                    }
                }}
              />
              <audio controls ref={QAudioRef}>
                  <source src={QAudioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
              </audio>

              <label htmlFor="back"><b>Back</b></label>
              <textarea
                placeholder="Enter Back Side"
                name="back"
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
              />

              <label htmlFor="imageA"><b>Answer Image</b></label>
              <input
                type="file"
                id="imageA"
                onChange={(e) => {
                    setAImage(e.target.files[0]);
                    setAImageUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {AImageUrl && <img src={AImageUrl} alt="answer preview" />}

              <label htmlFor="audioA"><b>Answer Sound</b></label>
              <input
                type="file"
                id="audioA"
                onChange={(e) => {
                    setAAudio(e.target.files[0]);
                    setAAudioUrl(URL.createObjectURL(e.target.files[0]));
                    if (AAudioRef.current) {
                        AAudioRef.current.pause();
                        AAudioRef.current.load();
                    }
                }}
              />
              <audio controls ref={AAudioRef}>
                  <source src={AAudioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
              </audio>

              <button type="submit">Add</button>
          </form>
      </div>
    );
}

export { addCard, AddCardComponent };