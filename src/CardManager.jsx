import React from 'react';

import { exportToJson } from "./Utils";
import { auth } from "./Firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import { addCard } from "./AddCard";

import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Typography, Box
} from '@mui/material';
import {useAuthState} from "react-firebase-hooks/auth";

const firestore = getFirestore();
const storage = getStorage();

export default function CardManager() {
    const [user, , ] = useAuthState(auth);
    const path = collection(firestore, "allCards", user.uid, "cards");
    const [cardsCollection] = useCollection(path);

    let cards = cardsCollection ? cardsCollection.docs.map((card) => {
        let id = card.id;
        card = card.data();
        card.id = id;
        return card
    }) : []

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
              All Cards
          </Typography>

          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell><b>Front</b></TableCell>
                          <TableCell><b>State</b></TableCell>
                          <TableCell><b>Review Date</b></TableCell>
                          <TableCell><b>Remove</b></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {cards && cards.map(c => (
                        <TableRow key={c.id}>
                            <TableCell>{c.front}</TableCell>
                            <TableCell>{c.state}</TableCell>
                            <TableCell>{c.reviewDate.toDate().toLocaleString()}</TableCell>
                            <TableCell>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => removeCard(c)}
                                >
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                      ))}
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