import { db } from '../firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';

// Per-user model helpers: /users/{uid} with subcollections /games and /series

// Simplified API requested by user
export async function setCurrentGame(uid: string, gameId: string | null) {
  if (!db) throw new Error('Firestore not initialized');
  const userDoc = doc(db, 'users', uid);
  await setDoc(userDoc, { currentGame: gameId ?? null }, { merge: true });
}

export async function setCurrentSeries(uid: string, seriesId: string | null) {
  if (!db) throw new Error('Firestore not initialized');
  const userDoc = doc(db, 'users', uid);
  await setDoc(userDoc, { currentSeries: seriesId ?? null }, { merge: true });
}

export async function getCurrent(uid: string) {
  if (!db) throw new Error('Firestore not initialized');
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as Record<string, any>) : null;
}

export async function setGame(uid: string, gameId: string, index: number) {
  if (!db) throw new Error('Firestore not initialized');
  const gDoc = doc(db, 'users', uid, 'games', gameId);
  await setDoc(gDoc, { index, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getGame(uid: string, gameId: string) {
  if (!db) throw new Error('Firestore not initialized');
  const snap = await getDoc(doc(db, 'users', uid, 'games', gameId));
  return snap.exists() ? (snap.data() as Record<string, any>) : null;
}

export async function setSeries(uid: string, seriesId: string, index: number) {
  if (!db) throw new Error('Firestore not initialized');
  const sDoc = doc(db, 'users', uid, 'series', seriesId);
  await setDoc(sDoc, { index, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getSeries(uid: string, seriesId: string) {
  if (!db) throw new Error('Firestore not initialized');
  const snap = await getDoc(doc(db, 'users', uid, 'series', seriesId));
  return snap.exists() ? (snap.data() as Record<string, any>) : null;
}

export async function deleteAllUserData(uid: string) {
  if (!db) throw new Error('Firestore not initialized');
  // delete games
  const gamesSnap = await getDocs(collection(db, 'users', uid, 'games'));
  let batch = writeBatch(db);
  let ops = 0;
  for (const d of gamesSnap.docs) {
    batch.delete(d.ref);
    ops++;
    if (ops >= 400) { await batch.commit(); batch = writeBatch(db); ops = 0; }
  }
  if (ops > 0) await batch.commit();

  const seriesSnap = await getDocs(collection(db, 'users', uid, 'series'));
  batch = writeBatch(db);
  ops = 0;
  for (const d of seriesSnap.docs) {
    batch.delete(d.ref);
    ops++;
    if (ops >= 400) { await batch.commit(); batch = writeBatch(db); ops = 0; }
  }
  if (ops > 0) await batch.commit();

  await deleteDoc(doc(db, 'users', uid));
}

export async function deleteGame(uid: string, gameId: string) {
  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'users', uid, 'games', gameId));
}

export async function deleteSeries(uid: string, seriesId: string) {
  if (!db) throw new Error('Firestore not initialized');
  await deleteDoc(doc(db, 'users', uid, 'series', seriesId));
}

export default {
  setCurrentGame,
  setCurrentSeries,
  getCurrent,
  setGame,
  getGame,
  setSeries,
  getSeries,
  deleteAllUserData,
  deleteGame,
  deleteSeries,
};
