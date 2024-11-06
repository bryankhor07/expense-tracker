import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAddUserFeedback } from "../../hooks/useAddUserFeedback";

export const UserFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [notification, setNotification] = useState("");
  const { addFeedback } = useAddUserFeedback();

  const handleGoBack = () => {
    navigate("/expense-tracker");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addFeedback(feedback);
    showNotification();
    setFeedback("");
  };

  const showNotification = () => {
    setNotification("Thank you for your feedback!");
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div className="feedback-container">
      {notification && <h1 className="notification">{notification}</h1>}

      <button className="back-button" onClick={handleGoBack}>
        Go back
      </button>
      <h1>We value your feedback!</h1>
      <form className="feedback-form" onSubmit={onSubmit}>
        <label htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          name="feedback"
          rows="4"
          cols="50"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};
