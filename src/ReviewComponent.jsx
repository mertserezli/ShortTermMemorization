import React, { useState, useEffect, useRef } from 'react';

import { auth, db } from './Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';

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

function getEarliestReviewDate(cards) {
  return Math.min(...cards.map((c) => c.reviewDate));
}

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

MediaDisplay.propTypes = {
  url: PropTypes.string,
  loaded: PropTypes.bool,
  onLoad: PropTypes.func,
  alt: PropTypes.string,
  type: PropTypes.oneOf(['image', 'audio']),
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

CardDisplay.propTypes = {
  card: PropTypes.shape({
    front: PropTypes.string.isRequired,
    back: PropTypes.string.isRequired,
  }).isRequired,
  urls: PropTypes.shape({
    QImg: PropTypes.string,
    QAudio: PropTypes.string,
    AImg: PropTypes.string,
    AAudio: PropTypes.string,
  }).isRequired,
  loaded: PropTypes.shape({
    QImg: PropTypes.bool,
    AImg: PropTypes.bool,
  }).isRequired,
  setLoaded: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  onShow: PropTypes.func.isRequired,
  onFeedback: PropTypes.func.isRequired,
};
function CardDisplay({
  card,
  urls,
  loaded,
  setLoaded,
  show,
  onShow,
  onFeedback,
}) {
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

  const path = collection(db, 'allCards', user.uid, 'cards');
  const [cardsCollection] = useCollection(path);
  const timeoutRef = useRef(null);

  const cards =
    cardsCollection?.docs
      .map((card) => ({
        ...card.data(),
        id: card.id,
        reviewDate: card.data().reviewDate.toDate(),
      }))
      .filter((card) => card.state !== 7) ?? [];

  const { urls, loaded, setLoaded } = useMediaUrls(curCard, user?.uid);

  const updateCardState = async (card, correct) => {
    const newState = Math.max(0, card.state + (correct ? 1 : -1));
    const newReviewDate = new Date();
    newReviewDate.setSeconds(
      newReviewDate.getSeconds() + STATE_INTERVALS[newState]
    );

    setShow(false);
    setCurCard(null);

    await updateDoc(doc(path, card.id), {
      reviewDate: newReviewDate,
      state: newState,
    });
  };

  const pickCard = () => {
    clearTimeout(timeoutRef.current);

    if (!cards?.length) {
      timeoutRef.current = setTimeout(pickCard, 5000);
      return;
    }

    const toReview = cards.filter((c) => c.reviewDate < new Date());

    if (curCard == null && toReview.length > 0) {
      setShow(false);
      setCurCard(toReview[0]);
      notifications.show('Flashcard Review', 'You have cards ready to review!');
    } else {
      timeoutRef.current = setTimeout(
        pickCard,
        getEarliestReviewDate(cards) - Date.now() + 500
      );
    }
  };

  useEffect(() => {
    pickCard();
    return () => clearTimeout(timeoutRef.current);
  }, [cardsCollection]);

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
          urls={urls}
          loaded={loaded}
          setLoaded={setLoaded}
          show={show}
          onShow={() => setShow(true)}
          onFeedback={(correct) => updateCardState(curCard, correct)}
        />
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          {!cards?.length ? (
            <Typography variant="h6">You have no cards. Add some</Typography>
          ) : (
            <CountdownCircle
              duration={(getEarliestReviewDate(cards) - Date.now()) / 1000}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
