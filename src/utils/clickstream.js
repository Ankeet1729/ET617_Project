import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logEvent = async (userId, eventType, details = {}) => {
  try {
    await addDoc(collection(db, "clickstream"), {
      userId,           // Who did the action
      eventType,        // What type of event (click, page_view, etc.)
      details,          // Extra info about the event
      timestamp: serverTimestamp() // When it happened (server time)
    });
  } catch (error) {
    console.error("Error logging event: ", error);
  }
};
