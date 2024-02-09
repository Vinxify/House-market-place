import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { SETTIMEOUT_SEC } from "../components/helper/helper_variable";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    if (email === "") {
      setBtnDisabled(true);
    } else if (email.trim() === "") {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset email");
    } finally {
      setTimeout(() => setLoading(false), SETTIMEOUT_SEC * 1000);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type='text'
            id='email'
            value={email}
            onChange={onChange}
            placeholder='Email'
            className='emailInput'
          />

          <Button onSubmit={onSubmit} btnDisabled={btnDisabled}>
            Reset Email
          </Button>
        </form>
        <Link to='/sign-in' className='forgotPasswordLink'>
          Sign In
        </Link>
      </main>
    </div>
  );
}

export default ForgetPassword;
