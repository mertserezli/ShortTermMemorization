import React, {useState} from 'react';

import { exportToJson } from "./Utils";
import { auth } from "./Firebase";
import { addCard } from "./AddCard";

import { useCollection } from "react-firebase-hooks/firestore";
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Typography, Box, LinearProgress, Tooltip, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const firestore = getFirestore();
const storage = getStorage();

function formatReviewDate(reviewDate) {
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const target = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());

    if (target.getTime() === today.getTime()) {
        return "Today, " + reviewDate.toLocaleTimeString();
    } else if (target.getTime() === tomorrow.getTime()) {
        return "Tomorrow, " + reviewDate.toLocaleTimeString();
    } else {
        return reviewDate.toLocaleString();
    }
}

export default function CardManager() {
    const [user, , ] = useAuthState(auth);
    const path = collection(firestore, "allCards", user.uid, "cards");
    const [cardsCollection] = useCollection(path);

    const [filter, setFilter] = useState("all");

    const cards = cardsCollection?.docs.map(card => ({
        ...card.data(),
        id: card.id,
        reviewDate: card.data().reviewDate.toDate(),
    })) ?? [];

    const filteredCards = cards.filter(c => {
        if (filter === "active") return c.state !== 7;
        if (filter === "graduated") return c.state === 7;
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

    const importJSON = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            let cardsToImport = JSON.parse(e.target.result);
            cardsToImport.forEach(c => addCard(c.front, c.back));
        };
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
                          <TableCell><b>Front</b></TableCell>
                          <TableCell><b>State</b></TableCell>
                          <TableCell><b>Review Date</b></TableCell>
                          <TableCell/>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredCards && filteredCards.length > 0 ? (
                        filteredCards.map(c => (
                            <TableRow key={c.id}  sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: (theme) => theme.palette.action.hover,
                                },
                            }}>
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
                                <TableCell>{c.state === 7 ? "No reviews left" : formatReviewDate(c.reviewDate)}</TableCell>
                                <TableCell>
                                    <Tooltip title="Remove">
                                        <IconButton
                                          size="small"
                                          onClick={() => removeCard(c)}
                                        >
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
                                            No cards yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Use the "Add Card" button to create your first card.
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
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => exportToJson(cards)}
              >
                  Export
              </Button>

              <label htmlFor="avatar">
                  <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                      Import:
                  </Typography>
              </label>
              <input
                type="file"
                id="avatar"
                name="import"
                accept=".json"
                onChange={importJSON}
              />
          </Box>
      </Box>
    );
}