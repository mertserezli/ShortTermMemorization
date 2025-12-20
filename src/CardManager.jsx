import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';

import { auth } from './Firebase';
import AnkiIcon from './icons/anki.svg';
import SuperMemoIcon from './icons/supermemo.png';

import { useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, doc, deleteDoc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const firestore = getFirestore();
const storage = getStorage();

function formatReviewDate(reviewDate) {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const target = new Date(
    reviewDate.getFullYear(),
    reviewDate.getMonth(),
    reviewDate.getDate()
  );

  if (target.getTime() === today.getTime()) {
    return 'Today, ' + reviewDate.toLocaleTimeString();
  } else if (target.getTime() === tomorrow.getTime()) {
    return 'Tomorrow, ' + reviewDate.toLocaleTimeString();
  } else {
    return 'Overdue,' + reviewDate.toLocaleDateString();
  }
}

export default function CardManager() {
  const [user, ,] = useAuthState(auth);
  const path = collection(firestore, 'allCards', user.uid, 'cards');
  const [cardsCollection] = useCollection(path);

  const [exporting, setExporting] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [filter, setFilter] = useState('all');

  const cards =
    cardsCollection?.docs.map((card) => ({
      ...card.data(),
      id: card.id,
      reviewDate: card.data().reviewDate.toDate(),
    })) ?? [];

  const filteredCards = cards.filter((c) => {
    if (filter === 'active') return c.state !== 7;
    if (filter === 'graduated') return c.state === 7;
    return true; // "all"
  });

  const removeCard = async (card) => {
    if (card.QImageId) {
      await deleteObject(ref(storage, `/${user.uid}/${card.QImageId}`));
    }
    if (card.AImageId) {
      await deleteObject(ref(storage, `/${user.uid}/${card.AImageId}`));
    }
    if (card.QAudioId) {
      await deleteObject(ref(storage, `/${user.uid}/${card.QAudioId}`));
    }
    if (card.AAudioId) {
      await deleteObject(ref(storage, `/${user.uid}/${card.AAudioId}`));
    }
    await deleteDoc(doc(path, card.id));
  };

  async function addFileToZip(zip, fileId) {
    const url = await getDownloadURL(ref(storage, `/${user.uid}/${fileId}`));
    const res = await fetch(url);
    const blob = await res.blob();
    zip.file(`collection.media/${fileId}`, blob);
  }

  async function exportToSuperMemo(
    cards,
    collectionTitle = 'ShortTermMemoExport'
  ) {
    const zip = new JSZip();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<SuperMemoCollection>\n`;

    xml += `\t<Count>${cards.length + 1}</Count>\n`;

    xml += `\t<SuperMemoElement>\n`;
    xml += `\t\t<ID>1</ID>\n`;
    xml += `\t\t<Title>${collectionTitle}</Title>\n`;
    xml += `\t\t<Type>Concept</Type>\n`;

    for (const card of cards) {
      const index = cards.indexOf(card);
      const id = index + 2; // IDs start at 2 for items
      xml += `\t\t<SuperMemoElement>\n`;
      xml += `\t\t\t<ID>${id}</ID>\n`;
      xml += `\t\t\t<Type>Item</Type>\n`;
      xml += `\t\t\t<Content>\n`;
      xml += `\t\t\t\t<Question>${card.front || ''}</Question>\n`;
      xml += `\t\t\t\t<Answer>${card.back || ''}</Answer>\n`;

      if (card.QImageId) {
        await addFileToZip(zip, card.QImageId);

        xml += `\t\t\t\t<Image>\n`;
        xml += `\t\t\t\t\t<URL>.\\collection.media\\${card.QImageId}</URL>\n`;
        xml += `\t\t\t\t\t<Name>${card.QImageId}</Name>\n`;
        xml += `\t\t\t\t\t<Answer>F</Answer>\n`;
        xml += `\t\t\t\t</Image>\n`;
      }

      if (card.QAudioId) {
        await addFileToZip(zip, card.QAudioId);

        xml += `\t\t\t\t<Sound>\n`;
        xml += `\t\t\t\t\t<Text>${card.QAudioId}</Text>\n`;
        xml += `\t\t\t\t\t<URL>.\\collection.media\\${card.QAudioId}</URL>\n`;
        xml += `\t\t\t\t\t<Name>${card.QAudioId}</Name>\n`;
        xml += `\t\t\t\t\t<Answer>F</Answer>\n`;
        xml += `\t\t\t\t</Sound>\n`;
      }

      if (card.AImageId) {
        await addFileToZip(zip, card.AImageId);

        xml += `\t\t\t\t<Image>\n`;
        xml += `\t\t\t\t\t<URL>.\\collection.media\\${card.AImageId}</URL>\n`;
        xml += `\t\t\t\t\t<Name>${card.AImageId}</Name>\n`;
        xml += `\t\t\t\t\t<Answer>T</Answer>\n`;
        xml += `\t\t\t\t</Image>\n`;
      }

      if (card.AAudioId) {
        await addFileToZip(zip, card.AAudioId);

        xml += `\t\t\t\t<Sound>\n`;
        xml += `\t\t\t\t\t<Text>${card.AAudioId}</Text>\n`;
        xml += `\t\t\t\t\t<URL>.\\collection.media\\${card.AAudioId}</URL>\n`;
        xml += `\t\t\t\t\t<Name>${card.AAudioId}</Name>\n`;
        xml += `\t\t\t\t\t<Answer>F</Answer>\n`;
        xml += `\t\t\t\t</Sound>\n`;
      }

      xml += `\t\t\t</Content>\n`;
      xml += `\t\t</SuperMemoElement>\n`;
    }

    xml += `\t</SuperMemoElement>\n`;
    xml += `</SuperMemoCollection>\n`;

    zip.file('supermemoItems.xml', xml);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'Supermemo_Export.zip');
  }

  async function exportToAnki(cards) {
    const zip = new JSZip();
    const rows = [];

    rows.push('Front, FrontImg, FrontSound, Back, BackImg, BackSound');

    for (const card of cards) {
      if (card.QImageId) await addFileToZip(zip, card.QImageId);
      if (card.AImageId) await addFileToZip(zip, card.AImageId);
      if (card.QAudioId) await addFileToZip(zip, card.QAudioId);
      if (card.AAudioId) await addFileToZip(zip, card.AAudioId);

      const frontParts = [];
      if (card.front) frontParts.push(card.front);
      else frontParts.push('');
      if (card.QImageId) frontParts.push(`<img src='${card.QImageId}'>`);
      else frontParts.push('');
      if (card.QAudioId) frontParts.push(`[sound:${card.QAudioId}]`);
      else frontParts.push('');

      const backParts = [];
      if (card.back) backParts.push(card.back);
      else backParts.push('');
      if (card.AImageId) backParts.push(`<img src='${card.AImageId}'>`);
      else backParts.push('');
      if (card.AAudioId) backParts.push(`[sound:${card.AAudioId}]`);
      else backParts.push('');

      const front = frontParts.join(', ');
      const back = backParts.join(', ');

      rows.push(`${front},${back}`);
    }

    const csvContent = rows.join('\n');
    zip.file('anki_cards.csv', csvContent);

    const apkgResponse = await fetch('/ExampleNoteType.apkg');
    const apkgBlob = await apkgResponse.blob();
    zip.file('ExampleNoteType.apkg', apkgBlob);

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'anki_export.zip');
  }

  const handleExport = async (type) => {
    setAnchorEl(null);
    setExporting(true);
    try {
      if (type === 'anki') await exportToAnki(cards);
      if (type === 'supermemo') await exportToSuperMemo(cards);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Cards
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, newFilter) => setFilter(newFilter)}
        sx={{ mb: 2 }}
        color="primary"
      >
        <ToggleButton value="all" sx={{ textTransform: 'none' }}>
          <ViewListIcon sx={{ mr: 1 }} /> All
        </ToggleButton>
        <ToggleButton value="active" sx={{ textTransform: 'none' }}>
          <PendingActionsIcon sx={{ mr: 1 }} /> Active
        </ToggleButton>
        <ToggleButton value="graduated" sx={{ textTransform: 'none' }}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Graduated
        </ToggleButton>
      </ToggleButtonGroup>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Front</b>
              </TableCell>
              <TableCell>
                <b>State</b>
              </TableCell>
              <TableCell>
                <b>Review Date</b>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCards && filteredCards.length > 0 ? (
              filteredCards.map((c) => (
                <TableRow
                  key={c.id}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.front}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${c.state}/7`}>
                      <LinearProgress
                        variant="determinate"
                        value={(c.state / 7) * 100}
                        sx={{ mt: 2 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {c.state === 7
                      ? 'No reviews left'
                      : formatReviewDate(c.reviewDate)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => removeCard(c)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No cards in this category
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Try switching filters above or add new cards to see them
                      here.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button
          variant="text"
          color="primary"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          endIcon={<ArrowDropDownIcon />}
          disabled={exporting}
        >
          {exporting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Export as...'
          )}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleExport('anki')}>
            <ListItemIcon>
              <img
                src={AnkiIcon}
                alt="Anki"
                style={{ width: 24, height: 24 }}
              />
            </ListItemIcon>
            <ListItemText primary="Anki CSV" />
          </MenuItem>
          <MenuItem onClick={() => handleExport('supermemo')}>
            <ListItemIcon>
              <img
                src={SuperMemoIcon}
                alt="SuperMemo"
                style={{ width: 24, height: 24 }}
              />
            </ListItemIcon>
            <ListItemText primary="SuperMemo XML" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
