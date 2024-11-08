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

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionTotal, setTransactionTotal] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();

  useEffect(() => {
    let unsubscribe;
    try {
      const queryTransactions = query(
        transactionCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      );
      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs = [];
        let totalIncome = 0;
        let totalExpenses = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;

          docs.push({ ...data, id });

          if (data.transactionType === "income") {
            totalIncome += Number(data.transactionAmount);
          } else {
            totalExpenses += Number(data.transactionAmount);
          }
        });
        setTransactions(docs);

        setTransactionTotal({
          balance: totalIncome - totalExpenses,
          income: totalIncome,
          expenses: totalExpenses,
        });
      });
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }

    // Cleanup function to unsubscribe on unmount
    return () => unsubscribe && unsubscribe();
  }, [userID]);

  return { transactions, transactionTotal }; // Return the transactions and transactionTotal state
};
