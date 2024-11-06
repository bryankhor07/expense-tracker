import { db } from "../config/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddUserFeedback = () => {
  const feedbackCollectionRef = collection(db, "user-feedback");
  const { userID } = useGetUserInfo();

  const addFeedback = async (feedback) => {
    await addDoc(feedbackCollectionRef, {
      userID,
      feedback,
      createdAt: serverTimestamp(),
    });
  };

  return { addFeedback };
};
