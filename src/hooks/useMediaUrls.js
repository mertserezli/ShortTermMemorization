import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../Firebase.jsx';

export function useMediaUrls(card, userId) {
  const [urls, setUrls] = useState({
    QImg: '',
    AImg: '',
    QAudio: '',
    AAudio: '',
  });
  const [loaded, setLoaded] = useState({ QImg: false, AImg: false });

  useEffect(() => {
    if (!card) return;

    const fetchUrl = async (id, key) => {
      if (id) {
        const url = await getDownloadURL(ref(storage, `/${userId}/${id}`));
        setUrls((prev) => ({ ...prev, [key]: url }));
      }
    };

    setUrls({ QImg: '', AImg: '', QAudio: '', AAudio: '' });
    setLoaded({ QImg: false, AImg: false });

    fetchUrl(card.QImageId, 'QImg');
    fetchUrl(card.AImageId, 'AImg');
    fetchUrl(card.QAudioId, 'QAudio');
    fetchUrl(card.AAudioId, 'AAudio');
  }, [card, userId]);

  return { urls, loaded, setLoaded };
}
