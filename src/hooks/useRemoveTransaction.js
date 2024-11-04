import { db } from "../config/firebase-config";
import { deleteDoc, doc, collection } from "firebase/firestore";

export const useRemoveTransaction = () => {
  // Create a reference to the transactions collection
  const transactionCollectionRef = collection(db, "transactions");

  const removeTransaction = async (transactionID) => {
    // Create a reference to the document to be deleted
    const transactionDocRef = doc(transactionCollectionRef, transactionID);

    // Delete the document
    await deleteDoc(transactionDocRef);
  };

  // Return the removeTransaction function
  return { removeTransaction };
};
