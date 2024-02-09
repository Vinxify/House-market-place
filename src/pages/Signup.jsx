import React from "react";
import { useState } from "react";

import { toast } from "react-toastify";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

import { timeout } from "../components/helper/timeOut";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import {
  SETTIMEOUT_SEC,
  TIMEOUT_SEC,
} from "../components/helper/helper_variable";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    //  Set btn disabled
    if (name === "" || email === "" || password === "") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getAuth();

      const userCredential = await Promise.race([
        timeout(TIMEOUT_SEC),
        createUserWithEmailAndPassword(auth, email, password),
      ]);

      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message.includes(" (auth/email-already-in-use)")) {
        toast.error("Email already used");
      } else if (err.message.includes("Request")) {
        toast.error(`${err.message}, Check your internet connection!!!`);
      } else if (err.message.includes("(auth/invalid-email)")) {
        toast.error("Invalid Email");
      } else if (
        err.message.includes("Password should be at least 6 characters")
      ) {
        toast.error("Password should be more than six characters");
      } else {
        toast.error("Something went wrong with the registration");
      }
    } finally {
      setBtnDisabled(true);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setTimeout(() => {
        setLoading(false);
      }, SETTIMEOUT_SEC * 1000);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container'>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome </p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type='type'
              className='nameInput'
              placeholder='Name'
              onChange={onChange}
              value={name}
              id='name'
            />
            <input
              type='email'
              className='emailInput'
              placeholder='Email'
              onChange={onChange}
              value={email}
              id='email'
            />

            <div className='passwordInputDiv'>
              <input
                type={showPassword ? "text" : "password"}
                className='passwordInput'
                placeholder='Password'
                id='password'
                value={password}
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt='showPassword'
                className='showPassword'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <Button onSubmit={onSubmit} btnDisabled={btnDisabled}>
              Sign up
            </Button>
          </form>
          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password?
          </Link>

          <OAuth />
          <Link to='/sign-in' className='registerLink'>
            Sign In Instead
          </Link>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
