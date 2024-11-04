import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import GoogleIcon from "./google-icon.webp";
import "./styles.css";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back!</h1>
        <p className="login-text">Sign in with Google to continue</p>
        <button className="login-button" onClick={signInWithGoogle}>
          <img src={GoogleIcon} alt="Google Icon" className="google-icon" />{" "}
          Sign In With Google
        </button>
      </div>
    </div>
  );
};
