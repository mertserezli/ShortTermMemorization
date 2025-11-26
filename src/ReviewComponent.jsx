import React, {useState, useContext, useEffect, useRef} from 'react';
import { ShowNotifications } from "./NotificationContextProvider";

import { auth, db, storage } from "./Firebase";
import { useCollection } from "react-firebase-hooks/firestore";

import Loading from "./LoadingComponent";
import CountdownCircle from "./CountdownCircle";

import { collection, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import {
    Box,
    Typography,
    Button,
    Divider,
    Paper
} from '@mui/material';
import {useAuthState} from "react-firebase-hooks/auth";

function getEarliestReviewDate(cards) {
    return Math.min(...cards.map(c => c.reviewDate));
}

export default function ReviewComponent() {
    const { showNotifications } = useContext(ShowNotifications);
    const [user, ] = useAuthState(auth);

    const path = collection(db, "allCards", user.uid, "cards");
    const [cardsCollection] = useCollection(path);

    const [curCard, setCurCard] = useState(null);
    const [show, setShow] = useState(false);

    const [QImgUrl, setQImgUrl] = useState("");
    const [QImgLoaded, setQImgLoaded] = useState(false);

    const [AImgUrl, setAImgUrl] = useState("");
    const [AImgLoaded, setAImgLoaded] = useState(false);

    const [QAudioUrl, setQAudioUrl] = useState("");
    const [AAudioUrl, setAAudioUrl] = useState("");

    const timeoutRef = useRef(null);

    const cards = cardsCollection?.docs.map(card => ({
        ...card.data(),
        id: card.id,
        reviewDate: card.data().reviewDate.toDate(),
    })) ?? [];

    const changeState = async (card, feedback) => {
        const stateToTime = {
            0: 5,
            1: 25,
            2: 2 * 60,
            3: 10 * 60,
            4: 60 * 60,
            5: 5 * 60 * 60,
            6: 24 * 60 * 60,
            7: 1,
        };

        let newState = card.state;

        if (feedback) {
            newState += 1;
        } else {
            newState -= 1;
            if (newState < 0) newState = 0;
        }

        setShow(false);
        setQImgLoaded(false);
        setAImgLoaded(false);
        setCurCard(null);

        const newReviewDate = new Date();
        newReviewDate.setSeconds(newReviewDate.getSeconds() + stateToTime[newState]);

        await updateDoc(doc(path, card.id), {
            reviewDate: newReviewDate,
            state: newState,
        });
    };

    function pickCard() {
        clearTimeout(timeoutRef.current);
        if (cards && cards.length > 0) {
            const toReview = cards.filter(
              c => c.reviewDate < new Date() && c.state < 7
            );
            if (curCard == null && toReview.length > 0) {
                setShow(false);
                setCurCard(toReview[0]);

                setQImgUrl("");
                setAImgUrl("");

                if (toReview[0].QImageId) {
                    getDownloadURL(ref(storage, `/${user.uid}/${toReview[0].QImageId}`))
                      .then(url => setQImgUrl(url));
                }

                if (toReview[0].AImageId) {
                    getDownloadURL(ref(storage, `/${user.uid}/${toReview[0].AImageId}`))
                      .then(url => setAImgUrl(url));
                }

                setQAudioUrl("");
                setAAudioUrl("");

                if (toReview[0].QAudioId) {
                    getDownloadURL(ref(storage, `/${user.uid}/${toReview[0].QAudioId}`))
                      .then(url => setQAudioUrl(url));
                }

                if (toReview[0].AAudioId) {
                    getDownloadURL(ref(storage, `/${user.uid}/${toReview[0].AAudioId}`))
                      .then(url => setAAudioUrl(url));
                }
            } else {
                timeoutRef.current = setTimeout(() => pickCard(), getEarliestReviewDate(cards) - new Date().getTime() + 500);
            }
        } else {
            timeoutRef.current = setTimeout(() => pickCard(), 5000);
        }
    }

    useEffect(() => {
        pickCard();
        return () => clearTimeout(timeoutRef.current);
    }, [cardsCollection]);

    return (
      <Box>
          {curCard ? (
            <Paper sx={{ p: 2, mb: 2 }}>
                {QImgUrl && (
                  <>
                      <Loading show={!QImgLoaded} />
                      <Box sx={{ textAlign: "center" }}>
                          <img
                            style={{ display: QImgLoaded ? "block" : "none", maxWidth: "100%" }}
                            src={QImgUrl}
                            alt="question"
                            onLoad={() => setQImgLoaded(true)}
                          />
                      </Box>
                  </>
                )}
                {QAudioUrl && (
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                      <audio controls>
                          <source src={QAudioUrl} type="audio/mp3" />
                          Your browser does not support the audio element.
                      </audio>
                  </Box>
                )}

                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    {curCard.front}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {show ? (
                  <>
                      {AImgUrl && (
                        <>
                            <Loading show={!AImgLoaded} />
                            <Box sx={{ textAlign: "center" }}>
                                <img
                                  style={{ display: AImgLoaded ? "block" : "none", maxWidth: "100%" }}
                                  src={AImgUrl}
                                  alt="answer"
                                  onLoad={() => setAImgLoaded(true)}
                                />
                            </Box>
                        </>
                      )}
                      {AAudioUrl && (
                        <Box sx={{ textAlign: "center", mt: 1 }}>
                            <audio controls>
                                <source src={AAudioUrl} type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                        </Box>
                      )}
                      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                          {curCard.back}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                          <Button variant="contained" color="error" onClick={() => changeState(curCard, false)}>
                              Again
                          </Button>
                          <Button variant="contained" color="success" onClick={() => changeState(curCard, true)}>
                              Good
                          </Button>
                      </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Button variant="contained" onClick={() => setShow(true)}>
                          Show
                      </Button>
                  </Box>
                )}
            </Paper>
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                {!cards || cards.length === 0 ? (
                  <Typography variant="h6">You have no cards. Add some</Typography>
                ) : (
                  <CountdownCircle
                    duration={(getEarliestReviewDate(cards) - new Date().getTime()) / 1000}
                  />
                )}
            </Box>
          )}
      </Box>
    );
}