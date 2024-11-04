import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useRemoveTransaction } from "../../hooks/useRemoveTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useRemoveAllTransaction } from "../../hooks/useRemoveAllTransaction";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import "./styles.css";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { removeTransaction } = useRemoveTransaction();
  const { removeAllTransaction } = useRemoveAllTransaction();
  const { transactions, transactionTotal } = useGetTransactions();
  const { name, profilePhoto, userID } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const [darkMode, setDarkMode] = useState(false);
  const { balance, income, expenses } = transactionTotal;

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
  };

  const deleteTransaction = (transactionId) => {
    removeTransaction(transactionId);
  };

  const deleteAllTransactions = (userID) => {
    removeAllTransaction(userID);
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <>
      <div
        className={
          darkMode
            ? "expense-tracker-body expense-tracker-body-dark-mode"
            : "expense-tracker-body"
        }
      >
        <div className="expense-tracker">
          <div className="container">
            <div className="header">
              <h1>{name}'s Expense Tracker</h1>
              <button
                className="dark-mode-button"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Dark mode" : "Light mode"}
              </button>
            </div>
            <div className="balance">
              <h3>Your Balance</h3>
              {balance >= 0 ? <h2>${balance}</h2> : <h2>-${balance * -1}</h2>}
            </div>
            <div className="summary">
              <div className="income">
                <h4>Income</h4>
                <p>${income}</p>
              </div>
              <div className="expenses">
                <h4>Expenses</h4>
                <p>${expenses}</p>
              </div>
            </div>
            <form className="add-transaction" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount"
                value={transactionAmount}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with up to two decimal places
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setTransactionAmount(value);
                  }
                }}
              />
              <div className="radio-buttons">
                <label htmlFor="expense">Expense</label>
                <input
                  type="radio"
                  id="expense"
                  value="expense"
                  checked={transactionType === "expense"}
                  onChange={(e) => setTransactionType(e.target.value)}
                />
                <label htmlFor="income">Income</label>
                <input
                  type="radio"
                  id="income"
                  value="income"
                  checked={transactionType === "income"}
                  onChange={(e) => setTransactionType(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-button">
                Add Transaction
              </button>
            </form>
          </div>
          {profilePhoto && (
            <div className="profile">
              <img src={profilePhoto} alt="Profile" />
              <button className="sign-out-button" onClick={signUserOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
        <div className="transactions">
          <h3>Transactions</h3>
          <div className="transaction-list">
            <ul>
              {transactions.map((transaction, index) => {
                const {
                  description,
                  transactionAmount,
                  transactionType,
                  transactionID,
                } = transaction;
                return (
                  <li
                    key={index}
                    className={`transaction-item ${transactionType}`}
                  >
                    <div className="transaction-details">
                      <h4>{description}</h4>
                      <p>
                        ${transactionAmount} •{" "}
                        <span className="transaction-type">
                          {transactionType}
                        </span>
                      </p>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteTransaction(transactionID)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              className="delete-all-button"
              onClick={() => deleteAllTransactions(userID)}
            >
              Delete All Transactions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
