import React, {useState, useContext, useEffect, useRef} from 'react';
import { ShowNotifications } from "./NotificationContextProvider";

import { auth, db, storage } from "./Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { ResizableBox } from 'react-resizable';

import Loading from "./LoadingComponent";
import CountdownCircle from "./CountdownCircle";

import { collection, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import {
    Box,
    Typography,
    Button,
    Divider,
    Paper, Dialog, Drawer, useTheme, useMediaQuery,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useAuthState} from "react-firebase-hooks/auth";
import {AddCardComponent} from "./AddCard";
import CardManager from "./CardManager";

function getEarliestReviewDate(cards) {
    return Math.min(...cards.map(c => c.reviewDate));
}

export default function ReviewComponent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { showNotifications } = useContext(ShowNotifications);
    const [user, ] = useAuthState(auth);

    const [openAddCardDialog, setOpenAddCardDialog] = useState(false);
    const [openCardManagerDrawer, setOpenCardManagerDrawer] = useState(false);

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
            0: 5,             // 5 seconds
            1: 25,            // 25 seconds
            2: 2 * 60,        // 2 minutes
            3: 10 * 60,       // 10 minutes
            4: 60 * 60,       // 1 hour
            5: 5 * 60 * 60,   // 5 hours
            6: 24 * 60 * 60,  // 1 day
            7: 1              // end
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
          {!isMobile &&
              <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2, // optional margin below
                }}
              >
                <Button variant="contained" color="primary" startIcon={<AddCircleIcon />}  onClick={() => setOpenAddCardDialog(true)}>
                  Add Card
                </Button>
                <Dialog open={openAddCardDialog} onClose={() => setOpenAddCardDialog(false)} fullWidth maxWidth="sm">
                    <AddCardComponent onClose={() => setOpenAddCardDialog(false)} />
                </Dialog>
                <Button variant="outlined" onClick={() => setOpenCardManagerDrawer(true)}>
                  View Cards
                </Button>
                  <Drawer
                    anchor="right"
                    open={openCardManagerDrawer}
                    onClose={() => setOpenCardManagerDrawer(false)}
                    variant="temporary"
                  >
                  <ResizableBox width={window.innerWidth/3}
                                height={window.innerHeight}
                                minConstraints={[300, window.innerHeight]}
                                axis="x"
                                resizeHandles={['w']}
                                handle={
                                    <Box
                                      sx={{
                                          width: 8,
                                          cursor: 'col-resize',
                                          bgcolor: 'divider',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          position: 'absolute',
                                          left: 0,
                                          top: 0,
                                          bottom: 0,
                                          '&:hover': {
                                              bgcolor: 'grey.400',
                                          },
                                      }}
                                    >
                                        <DragIndicatorIcon fontSize="small" color="disabled" />
                                    </Box>
                                }
                  >
                      <Box sx={{ pl: 2, height: '100%', overflow: 'auto' }}>
                          <CardManager />
                      </Box>
                  </ResizableBox>
                </Drawer>
              </Box>
          }
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

                <Typography variant="h6" align="center" sx={{ mt: 2, whiteSpace: "pre-line" }}>
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
                      <Typography variant="h6" align="center" sx={{ mt: 2, whiteSpace: "pre-line" }}>
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