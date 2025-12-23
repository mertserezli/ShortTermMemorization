import React, { useState, useEffect, useRef } from 'react';

import { auth, db } from './Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ResizableBox } from 'react-resizable';

import { AddCardComponent } from './AddCard';
import Loading from './LoadingComponent';
import CountdownCircle from './CountdownCircle';
import CardManager from './CardManager';
import { useNotifications, useMediaUrls } from './hooks';

import { collection, doc, updateDoc } from 'firebase/firestore';

import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Dialog,
  Drawer,
  useTheme,
  useMediaQuery,
  ToggleButton,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StorageIcon from '@mui/icons-material/Storage';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useAuthState } from 'react-firebase-hooks/auth';

const STATE_INTERVALS = {
  0: 5, // 5 seconds
  1: 25, // 25 seconds
  2: 2 * 60, // 2 minutes
  3: 10 * 60, // 10 minutes
  4: 60 * 60, // 1 hour
  5: 5 * 60 * 60, // 5 hours
  6: 24 * 60 * 60, // 1 day
  7: 1, // end
};

function MediaDisplay({ url, loaded, onLoad, alt, type = 'image' }) {
  if (!url) return null;

  if (type === 'image') {
    return (
      <>
        <Loading show={!loaded} />
        <Box sx={{ textAlign: 'center' }}>
          <img
            style={{ display: loaded ? 'block' : 'none', maxWidth: '100%' }}
            src={url}
            alt={alt}
            onLoad={onLoad}
          />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 1 }}>
      <audio controls>
        <source src={url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
}

function CardDisplay({ card, show, onShow, onFeedback }) {
  const { urls, loaded, setLoaded } = useMediaUrls(card, auth.currentUser.uid);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <MediaDisplay
        url={urls.QImg}
        loaded={loaded.QImg}
        onLoad={() => setLoaded((prev) => ({ ...prev, QImg: true }))}
        alt="question"
      />
      <MediaDisplay url={urls.QAudio} type="audio" />

      <Typography
        variant="h6"
        align="center"
        sx={{ mt: 2, whiteSpace: 'pre-line' }}
      >
        {card.front}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {show ? (
        <>
          <MediaDisplay
            url={urls.AImg}
            loaded={loaded.AImg}
            onLoad={() => setLoaded((prev) => ({ ...prev, AImg: true }))}
            alt="answer"
          />
          <MediaDisplay url={urls.AAudio} type="audio" />

          <Typography
            variant="h6"
            align="center"
            sx={{ mt: 2, whiteSpace: 'pre-line' }}
          >
            {card.back}
          </Typography>

          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => onFeedback(false)}
            >
              Again
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => onFeedback(true)}
            >
              Good
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={onShow}>
            Show
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default function ReviewComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user] = useAuthState(auth);
  const notifications = useNotifications();

  const [openAddCardDialog, setOpenAddCardDialog] = useState(false);
  const [openCardManagerDrawer, setOpenCardManagerDrawer] = useState(false);
  const [curCard, setCurCard] = useState(null);
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(Date.now());

  const path = collection(db, 'allCards', user.uid, 'cards');
  const [cardsCollection] = useCollection(path);

  const cards =
    cardsCollection?.docs
      .map((card) => ({
        ...card.data(),
        id: card.id,
        reviewDate: card.data().reviewDate.toDate(),
      }))
      .filter((card) => card.state !== 7) ?? [];

  const cardsToReview = cards.filter((c) => c.reviewDate.getTime() <= now);

  const earliestReviewDate =
    cards.length > 0
      ? Math.min(...cards.map((c) => c.reviewDate.getTime()))
      : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (curCard && !cards.find((c) => c.id === curCard.id)) {
      setCurCard(null);
      setShow(false);
      return;
    }

    if (curCard == null && cardsToReview.length > 0) {
      setCurCard(cardsToReview[0]);
    }
  }, [cardsToReview, curCard, cards]);

  const prevCardRef = useRef(null);
  useEffect(() => {
    if (
      curCard &&
      curCard !== prevCardRef.current &&
      prevCardRef.current !== null
    ) {
      notifications.show('Flashcard Review', 'You have cards ready to review!');
    }
    prevCardRef.current = curCard;
  }, [curCard, notifications]);

  const updateCardState = async (card, correct) => {
    const newState = Math.max(0, card.state + (correct ? 1 : -1));
    const newReviewDate = new Date();
    newReviewDate.setSeconds(
      newReviewDate.getSeconds() + STATE_INTERVALS[newState]
    );

    setShow(false);

    const updatedNow = Date.now();
    const nextCardsToReview = cards
      .filter((c) => c.id !== card.id) // Exclude current card
      .filter((c) => c.reviewDate.getTime() <= updatedNow);

    const nextCard = nextCardsToReview.length > 0 ? nextCardsToReview[0] : null;

    await updateDoc(doc(path, card.id), {
      reviewDate: newReviewDate,
      state: newState,
    });

    setCurCard(nextCard);
    setNow(updatedNow);
  };

  return (
    <Box>
      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => setOpenAddCardDialog(true)}
          >
            Add Card
          </Button>

          <ToggleButton
            value="notifications"
            selected={notifications.enabled}
            onChange={notifications.toggle}
            color="primary"
          >
            {notifications.enabled ? 'Notifications ON' : 'Notifications OFF'}
          </ToggleButton>

          <Button
            variant="outlined"
            endIcon={<StorageIcon />}
            onClick={() => setOpenCardManagerDrawer(true)}
          >
            View Cards
          </Button>
        </Box>
      )}

      <Dialog
        open={openAddCardDialog}
        onClose={() => setOpenAddCardDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <AddCardComponent onClose={() => setOpenAddCardDialog(false)} />
      </Dialog>

      <Drawer
        anchor="right"
        open={openCardManagerDrawer}
        onClose={() => setOpenCardManagerDrawer(false)}
      >
        <ResizableBox
          width={window.innerWidth / 3}
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
                '&:hover': { bgcolor: 'grey.400' },
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

      {curCard ? (
        <CardDisplay
          card={curCard}
          show={show}
          onShow={() => setShow(true)}
          onFeedback={(correct) => updateCardState(curCard, correct)}
        />
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          {!cards?.length ? (
            <Typography variant="h6">You have no cards. Add some</Typography>
          ) : (
            <CountdownCircle targetTime={earliestReviewDate} />
          )}
        </Box>
      )}
    </Box>
  );
}
