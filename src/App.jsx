import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Explore from "./pages/Explore";
import ForgetPassword from "./pages/ForgetPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
        </Routes>

        <Navbar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
