import React, { useState } from 'react';
import {auth} from "./AuthProvider";
import {v4 as uuidv4} from "uuid";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firestore = firebase.firestore();
const storage = firebase.storage();

const addCard = async (front, back, QImage, AImage) => {
    const query = firestore.collection('allCards').doc(auth.currentUser.uid).collection('cards');

    const revDate = new Date();
    revDate.setSeconds(revDate.getSeconds()+ 5);
    let QImageId = null;
    let AImageId = null;

    if(QImage) {
        QImageId = uuidv4();
        storage.ref(`/${auth.currentUser.uid}/${QImageId}`).put(QImage, {contentType: 'image/jpg'});
    }
    if(AImage){
        AImageId = uuidv4();
        storage.ref(`/${auth.currentUser.uid}/${AImageId}`).put(AImage, {contentType: 'image/jpg'});
    }

    await query.add({front, back, QImageId, AImageId, state:0, reviewDate:revDate});
};

function AddCardComponent(){
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const [QImageURL, setQImageUrl] = useState('');
    const [QImage, setQImage] = useState(null);

    const [AImageURL, setAImageUrl] = useState('');
    const [AImage, setAImage] = useState(null);

    const onAddCard = (e) => {
        e.preventDefault();
        addCard(front, back, QImage, AImage);

        setFront('');
        setBack('');
        setQImage(null);
        setQImageUrl('');

        setAImage(null);
        setAImageUrl('');
    };

    return (
        <div className={"centerContents"}>
            <form onSubmit={onAddCard} style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap", width: "75%"}}>
                <label htmlFor="front"><b>Front</b></label>
                <textarea placeholder="Enter Front Side" name="front" id="front" value={front} onChange={(e) => setFront(e.target.value)} />

                <label htmlFor="back"><b>Back</b></label>
                <textarea placeholder="Enter Back Side" name="back" id="back" value={back} onChange={(e) => setBack(e.target.value)} />

                <label htmlFor="imageQ"><b>Question Image</b></label>
                <input type="file" id="imageQ" onChange={(e) => {
                    setQImage(e.target.files[0]);
                    setQImageUrl(URL.createObjectURL(e.target.files[0]));
                }}/>
                <img src={QImageURL} alt={"question preview"}/>

                <label htmlFor="imageA"><b>Answer Image</b></label>
                <input type="file" id="imageA" onChange={(e) => {
                    setAImage(e.target.files[0]);
                    setAImageUrl(URL.createObjectURL(e.target.files[0]));
                }}/>
                <img src={AImageURL} alt={"answer preview"}/>

                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export {addCard, AddCardComponent}