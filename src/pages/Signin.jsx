import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    // set btndisabled
    if (email === "" || password === "") {
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
        signInWithEmailAndPassword(auth, email, password),
      ]);

      if (userCredential.user) {
        navigate("/");
      }
    } catch (err) {
      if (err.message.includes("Request")) {
        toast.error(`${err.message}, Check your internet connection!!!`);
      } else {
        toast.error("Bad User Credentials");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, SETTIMEOUT_SEC * 1000);
      setFormData((prevState) => ({ ...prevState, password: "" }));
      setBtnDisabled(true);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container'>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome back</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
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
              Sign in
            </Button>
          </form>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password?
          </Link>

          <OAuth />
          <Link to='/sign-up' className='registerLink'>
            Sign Up instead
          </Link>
        </main>
      </div>
    </div>
  );
}

export default SignIn;
