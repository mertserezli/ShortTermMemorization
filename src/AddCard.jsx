import React, { useState, useRef } from 'react';
import { auth, storage } from "./Firebase";
import { v4 as uuidv4 } from "uuid";

import {
    getFirestore,
    collection,
    doc,
    addDoc
} from "firebase/firestore";
import {
    ref,
    uploadBytes
} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Stack
} from '@mui/material';

const firestore = getFirestore();

const addCard = async (user, front, back, QImage, AImage, QAudio, AAudio) => {
    const cardsRef = collection(doc(collection(firestore, "allCards"), user.uid), "cards");

    const revDate = new Date();
    revDate.setSeconds(revDate.getSeconds() + 5);

    let QImageId = null;
    let AImageId = null;
    let QAudioId = null;
    let AAudioId = null;

    if (QImage) {
        QImageId = uuidv4();
        await uploadBytes(ref(storage, `/${user.uid}/${QImageId}`), QImage, { contentType: 'image/jpg' });
    }
    if (AImage) {
        AImageId = uuidv4();
        await uploadBytes(ref(storage, `/${user.uid}/${AImageId}`), AImage, { contentType: 'image/jpg' });
    }

    if (QAudio) {
        QAudioId = uuidv4();
        await uploadBytes(ref(storage, `/${user.uid}/${QAudioId}`), QAudio, { contentType: 'audio/mp3' });
    }
    if (AAudio) {
        AAudioId = uuidv4();
        await uploadBytes(ref(storage, `/${user.uid}/${AAudioId}`), AAudio, { contentType: 'audio/mp3' });
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
    const [user] = useAuthState(auth);

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
        await addCard(user, front, back, QImage, AImage, QAudio, AAudio);

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
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>
                  Add New Card
              </Typography>
              <form onSubmit={onAddCard}>
                  <Stack spacing={2}>
                      <TextField
                        label="Front"
                        multiline
                        minRows={3}
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        fullWidth
                      />

                      <Button variant="outlined" component="label">
                          Upload Question Image
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                setQImage(e.target.files[0]);
                                setQImageUrl(URL.createObjectURL(e.target.files[0]));
                            }}
                          />
                      </Button>
                      {QImageUrl && (
                        <Box textAlign="center">
                            <img src={QImageUrl} alt="question preview" style={{ maxWidth: '100%', marginTop: 8 }} />
                        </Box>
                      )}

                      <Button variant="outlined" component="label">
                          Upload Question Audio
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                setQAudio(e.target.files[0]);
                                setQAudioUrl(URL.createObjectURL(e.target.files[0]));
                                if (QAudioRef.current) {
                                    QAudioRef.current.pause();
                                    QAudioRef.current.load();
                                }
                            }}
                          />
                      </Button>
                      {QAudioUrl && (
                        <audio controls ref={QAudioRef} style={{ width: '100%' }}>
                            <source src={QAudioUrl} type="audio/mp3" />
                        </audio>
                      )}

                      <TextField
                        label="Back"
                        multiline
                        minRows={3}
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        fullWidth
                      />

                      <Button variant="outlined" component="label">
                          Upload Answer Image
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                setAImage(e.target.files[0]);
                                setAImageUrl(URL.createObjectURL(e.target.files[0]));
                            }}
                          />
                      </Button>
                      {AImageUrl && (
                        <Box textAlign="center">
                            <img src={AImageUrl} alt="answer preview" style={{ maxWidth: '100%', marginTop: 8 }} />
                        </Box>
                      )}

                      <Button variant="outlined" component="label">
                          Upload Answer Audio
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                setAAudio(e.target.files[0]);
                                setAAudioUrl(URL.createObjectURL(e.target.files[0]));
                                if (AAudioRef.current) {
                                    AAudioRef.current.pause();
                                    AAudioRef.current.load();
                                }
                            }}
                          />
                      </Button>
                      {AAudioUrl && (
                        <audio controls ref={AAudioRef} style={{ width: '100%' }}>
                            <source src={AAudioUrl} type="audio/mp3" />
                        </audio>
                      )}

                      <Button type="submit" variant="contained" color="primary">
                          Add Card
                      </Button>
                  </Stack>
              </form>
          </Paper>
      </Box>
    );
}

export { addCard, AddCardComponent };