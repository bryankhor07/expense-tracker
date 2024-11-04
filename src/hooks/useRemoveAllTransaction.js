import { db } from "../config/firebase-config";
import { deleteDoc, collection, getDocs } from "firebase/firestore";

export const useRemoveAllTransaction = () => {
  // Create a reference to the transactions collection
  const transactionCollectionRef = collection(db, "transactions");

  const removeAllTransaction = async (userID) => {
    // Get all the documents in the transactions collection
    const transactions = await getDocs(transactionCollectionRef);

    // Loop through each document and delete it
    transactions.forEach(async (doc) => {
      // Check if the document belongs to the user
      if (doc.data().userID === userID) {
        await deleteDoc(doc.ref);
      }
    });
  };

  return { removeAllTransaction };
};
