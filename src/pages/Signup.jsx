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

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

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
      toast.error("Something went wrong with the registration");
    }
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome back</p>
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

            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className='signUpBar'>
              <p className='signUpText'>Sign In</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>
          <Link to='/sign-in' className='registerLink'>
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;