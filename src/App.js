import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth/index";
import { ExpenseTracker } from "./pages/expense-tracker/index";
import { UserFeedback } from "./pages/user-feedback/index";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Auth />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/user-feedback" element={<UserFeedback />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
