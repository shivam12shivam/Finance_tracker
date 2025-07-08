import { useState } from "react";
import LogIn from "./components/Login";
import SignUp from "./components/Signup";
import HomePage from "./components/HomePage";
import { useSelector } from "react-redux";
import axios from "axios";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "./redux/userSlice";
import Dashboard from "./components/DashBoard";
import MonthlyReport from "./components/MonthlyExpense";

function App() {
  const [count, setCount] = useState(0);
  const isAuth = useSelector((state) => state.auth.isAuth);

  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "https://finance-tracker-bgrn.onrender.com/auth/check-auth",
          {
            withCredentials: true,
          }
        );
        console.log("res data", response.data.user);
        console.log("res data", response.data.token);

        if (response.data) {
          console.log("setting dispatch");
          dispatch(
            setLogin({
              user: response.data.user,
              isAuthenticated: true,
              token: response.data.token, 
            })
          );
          console.log("is Auth status: ", isAuth);
        }
      } catch (error) {

        console.error("Authentication check failed:", error);
        
  
      }
    };
    if (!isAuth) {
      checkAuthStatus();
    }
  }, [dispatch, isAuth]);

  return (
    <>
    
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/home" /> : <LogIn />}
        />
        <Route
          path="/signup"
          element={isAuth ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route
          path="/home"
          element={isAuth ? <HomePage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/signup" />}
        />
        <Route
          path="/monthlyreport"
          element={isAuth ? <MonthlyReport/> : <Navigate to="/signup" />}
        />
        
      </Routes>
    
    </>
  );
}

export default App;
