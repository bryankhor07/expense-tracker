import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetBudget = () => {
  const [budget, setBudget] = useState(0);
  const { userID } = useGetUserInfo();

  const budgetCollectionRef = collection(db, "budgets");

  useEffect(() => {
    const queryBudget = query(
      budgetCollectionRef,
      where("userID", "==", userID),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryBudget, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        setBudget(data.budgetAmount);
      });
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [userID]); // Ensure this runs again if userID changes
  return { budget };
};
