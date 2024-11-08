import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const useAddBudget = () => {
  const { userID } = useGetUserInfo();
  const addBudget = async ({ budgetAmount }) => {
    const budgetDocRef = doc(db, "budgets", userID); // Reference to the user's budget document

    // Use setDoc with merge: true to update or create the document
    await setDoc(
      budgetDocRef,
      {
        userID,
        budgetAmount,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  return { addBudget };
};
