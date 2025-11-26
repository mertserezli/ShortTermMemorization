import React from 'react';
import { auth } from "./Firebase";
import { exportToJson } from "./Utils";
import { useCollection } from "react-firebase-hooks/firestore";

import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    deleteDoc
} from "firebase/firestore";
import {
    getStorage,
    ref,
    deleteObject
} from "firebase/storage";

import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Typography, Box
} from '@mui/material';
import {useAuthState} from "react-firebase-hooks/auth";

const firestore = getFirestore();
const storage = getStorage();

export default function GraduatedCards() {
    const [user, , ] = useAuthState(auth);

    const path = collection(firestore, "allCards", user.uid, "cards");
    const graduatedQuery = query(path, where("state", "==", 7));
    const [cardsCollection] = useCollection(graduatedQuery);

    let cards = cardsCollection
      ? cardsCollection.docs.map((card) => {
          let id = card.id;
          let data = card.data();
          return { ...data, id };
      })
      : [];

    const removeCard = async (card) => {
        if (card.QImageId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.QImageId}`));
        }
        if (card.AImageId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.AImageId}`));
        }
        if (card.QAudioId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.QAudioId}`));
        }
        if (card.AAudioId) {
            await deleteObject(ref(storage, `/${auth.currentUser.uid}/${card.AAudioId}`));
        }

        await deleteDoc(doc(path, card.id));
    };

    return (
      <Box>
          <Typography variant="h4" gutterBottom>
              Graduated Cards
          </Typography>

          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell><b>Front</b></TableCell>
                          <TableCell><b>Back</b></TableCell>
                          <TableCell><b>Remove</b></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {cards && cards.map(c => (
                        <TableRow key={c.id}>
                            <TableCell>{c.front}</TableCell>
                            <TableCell>{c.back}</TableCell>
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
                onClick={() => exportToJson(cards)}
              >
                  Export
              </Button>
          </Box>
      </Box>
    );
}