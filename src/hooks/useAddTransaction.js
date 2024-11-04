import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();
  const addTransaction = async ({
    description,
    transactionAmount,
    transactionType,
  }) => {
    // First, create the document and get its reference
    const docRef = await addDoc(transactionCollectionRef, {
      userID,
      description,
      transactionAmount,
      transactionType,
      createdAt: serverTimestamp(),
    });
    // Then, add the document ID as transactionId in the document itself
    await updateDoc(docRef, { transactionID: docRef.id });
  };
  return { addTransaction };
};
