import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { auth, storage } from './Firebase';
import { getFirestore, collection, doc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Box,
  TextField,
  Button,
  Stack,
  DialogActions,
  DialogTitle,
  DialogContent,
  Alert,
} from '@mui/material';
import { useTour } from '@reactour/tour';

const firestore = getFirestore();

const addCard = async (user, front, back, QImage, AImage, QAudio, AAudio) => {
  const cardsRef = collection(
    doc(collection(firestore, 'allCards'), user.uid),
    'cards'
  );

  const reviewDate = new Date();
  reviewDate.setSeconds(reviewDate.getSeconds() + 5);

  let QImageId = null;
  let AImageId = null;
  let QAudioId = null;
  let AAudioId = null;

  if (QImage) {
    const ext = QImage.name.split('.').pop();
    QImageId = `${uuidv4()}.${ext}`;
    await uploadBytes(ref(storage, `/${user.uid}/${QImageId}`), QImage, {
      contentType: QImage.type,
    });
  }
  if (AImage) {
    const ext = AImage.name.split('.').pop();
    AImageId = `${uuidv4()}.${ext}`;
    await uploadBytes(ref(storage, `/${user.uid}/${AImageId}`), AImage, {
      contentType: 'image/jpg',
    });
  }

  if (QAudio) {
    const ext = QAudio.name.split('.').pop();
    QAudioId = `${uuidv4()}.${ext}`;
    await uploadBytes(ref(storage, `/${user.uid}/${QAudioId}`), QAudio, {
      contentType: 'audio/mp3',
    });
  }
  if (AAudio) {
    const ext = AAudio.name.split('.').pop();
    AAudioId = `${uuidv4()}.${ext}`;
    await uploadBytes(ref(storage, `/${user.uid}/${AAudioId}`), AAudio, {
      contentType: 'audio/mp3',
    });
  }

  await addDoc(cardsRef, {
    front,
    back,
    QImageId,
    AImageId,
    QAudioId,
    AAudioId,
    state: 0,
    reviewDate,
  });
};

function AddCardComponent({ onClose }) {
  const { t } = useTranslation();
  const {
    isOpen: isTourOpen,
    currentStep: currentTourStep,
    setCurrentStep: setCurrentTourStep,
  } = useTour();
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

  const QAudioRef = useRef(null);
  const AAudioRef = useRef(null);

  const isAnon = user.isAnonymous;

  useEffect(() => {
    if (
      isTourOpen &&
      1 <= currentTourStep &&
      currentTourStep <= 3 &&
      !front &&
      !back
    ) {
      setFront('What is the capital city of France');
      setBack('Paris');
    }
    if (isTourOpen && currentTourStep === 4 && front !== '') {
      addCard(user, front, back, QImage, AImage, QAudio, AAudio);
    }
  }, [isTourOpen, currentTourStep]);

  const onAddCard = async (e) => {
    e.preventDefault();
    await addCard(user, front, back, QImage, AImage, QAudio, AAudio);

    if (isTourOpen && currentTourStep === 3) {
      setCurrentTourStep((currentStep) => currentStep + 1);
    }

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

    onClose();
  };

  return (
    <>
      <DialogTitle>{t('addCard')}</DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
      >
        <form onSubmit={onAddCard}>
          <Stack spacing={2}>
            {isAnon && <Alert severity="warning">{t('anonWarning')}</Alert>}

            <TextField
              label={t('front')}
              multiline
              minRows={3}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              fullWidth
              data-tour="card-front"
            />

            <Button
              variant="outlined"
              component="label"
              disabled={isAnon}
              data-tour="card-image"
            >
              {t('uploadQImage')}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setQImage(e.target.files[0]);
                  setQImageUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Button>
            {QImageUrl && (
              <Box textAlign="center">
                <img
                  src={QImageUrl}
                  alt={t('questionPreview')}
                  style={{ maxWidth: '100%', marginTop: 8 }}
                />
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              disabled={isAnon}
              data-tour="card-audio"
            >
              {t('uploadQAudio')}
              <input
                type="file"
                accept="audio/*"
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
              label={t('back')}
              multiline
              minRows={3}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              fullWidth
              data-tour="card-back"
            />

            <Button variant="outlined" component="label" disabled={isAnon}>
              {t('uploadAImage')}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setAImage(e.target.files[0]);
                  setAImageUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Button>
            {AImageUrl && (
              <Box textAlign="center">
                <img
                  src={AImageUrl}
                  alt={t('answerPreview')}
                  style={{ maxWidth: '100%', marginTop: 8 }}
                />
              </Box>
            )}

            <Button variant="outlined" component="label" disabled={isAnon}>
              {t('uploadAAudio')}
              <input
                type="file"
                accept="audio/*"
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

            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-tour="add-card-modal"
              >
                {t('addCard')}
              </Button>
            </DialogActions>
          </Stack>
        </form>
      </DialogContent>
    </>
  );
}

export { addCard, AddCardComponent };
