import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useRemoveTransaction } from "../../hooks/useRemoveTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useRemoveAllTransaction } from "../../hooks/useRemoveAllTransaction";
import { useAddBudget } from "../../hooks/useAddBudget";
import { useGetBudget } from "../../hooks/useGetBudget";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import "./styles.css";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { removeTransaction } = useRemoveTransaction();
  const { removeAllTransaction } = useRemoveAllTransaction();
  const { addBudget } = useAddBudget();
  const { transactions, transactionTotal } = useGetTransactions();
  const { budget } = useGetBudget();
  const { name, profilePhoto, userID } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const [darkMode, setDarkMode] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [notification, setNotification] = useState("");
  const [editBudget, setEditBudget] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const { balance, income, expenses } = transactionTotal;
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  useEffect(() => {
    if (!isInitialLoad) {
      if (budget - expenses < 0) {
        showNotification(
          "Warning: You have exceeded your budget. Please consider reducing your expenses."
        );
      } else if (budget - expenses === 0) {
        showNotification(
          "You have reached your budget. Consider reducing your expenses to save more."
        );
      } else if (budget - expenses < 100) {
        showNotification(
          "You are close to reaching your budget. Consider reducing your expenses to save more."
        );
      }
    } else {
      setIsInitialLoad(false); // Set this to false after the first run
    }
  }, [budget, expenses]);

  // Logic to filter transactions based on startDate and endDate
  const applyDateFilter = () => {
    setFilteredTransactions([]);
    const startDateArray = startDate.split("-").map(Number);
    const endDateArray = endDate.split("-").map(Number);
    transactions.forEach((transaction) => {
      // Check if the transaction date is within the range
      // If it is, add it to the filteredTransactions array
      const transactionDate = new Date(
        transaction.createdAt.seconds * 1000 +
          transaction.createdAt.nanoseconds / 1000000
      ).toLocaleDateString();

      const transactionDateArray = transactionDate.split("/").map(Number);
      if (
        new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2]) <=
          new Date(
            transactionDateArray[2],
            transactionDateArray[0] - 1,
            transactionDateArray[1]
          ) &&
        new Date(
          transactionDateArray[2],
          transactionDateArray[0] - 1,
          transactionDateArray[1]
        ) <= new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2])
      ) {
        setFilteredTransactions((prevTransactions) => [
          ...prevTransactions,
          transaction,
        ]);
      }
    });
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    // Logic to reset the transaction list to show all items
    setFilteredTransactions([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });
    showNotification("Transaction successful");
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

  const redirectToUserFeedback = () => {
    navigate("/user-feedback");
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
              <div className="budget">
                <h4>Budget</h4>
                {editBudget ? (
                  <input
                    type="text"
                    placeholder="Budget"
                    className="budget-input"
                    value={budgetAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setBudgetAmount(value);
                      }
                    }}
                  ></input>
                ) : (
                  <p>${budget}</p>
                )}
                <button
                  className="edit-budget-button"
                  onClick={() => {
                    if (editBudget) {
                      // Save changes when exiting edit mode
                      setBudgetAmount(budgetAmount);
                      addBudget({ budgetAmount });
                    }
                    // Toggle edit mode
                    setEditBudget(!editBudget);
                  }}
                >
                  {editBudget ? "Save Changes" : "Edit Budget"}
                </button>
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
              {notification && (
                <h3 className="transaction-notification">{notification}</h3>
              )}
              <button type="submit" className="submit-button">
                Add Transaction
              </button>
              <button
                onClick={redirectToUserFeedback}
                className="user-feedback-link"
              >
                Have ideas to make this app even better? Share them here!
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
        <div className="filter-transaction-container">
          <div className="filter">
            <h3>Filter by Date</h3>
            <div className="filter-by-date">
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <button onClick={applyDateFilter}>Apply Filter</button>
              <button onClick={clearDateFilter}>Clear Filter</button>
            </div>
            <div className="transaction-list">
              <ul>
                {filteredTransactions.map((transaction, index) => {
                  const {
                    description,
                    transactionAmount,
                    transactionType,
                    transactionID,
                    createdAt,
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
                        <p className="transaction-date">
                          {new Date(
                            createdAt.seconds * 1000 +
                              createdAt.nanoseconds / 1000000
                          ).toLocaleDateString()}
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
            </div>
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
                    createdAt,
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
                        <p className="transaction-date">
                          {createdAt
                            ? new Date(
                                createdAt.seconds * 1000 +
                                  createdAt.nanoseconds / 1000000
                              ).toLocaleDateString()
                            : "Loading..."}
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
      </div>
    </>
  );
};
