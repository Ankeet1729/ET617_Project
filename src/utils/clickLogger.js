import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const logEvent = async (userId, action, metadata = {}) => {
  await addDoc(collection(db, 'clickstream'), {
    userId,
    action,
    metadata,
    timestamp: serverTimestamp(),
  });
};

