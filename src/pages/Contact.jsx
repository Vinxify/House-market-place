import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase.config";
import { toast } from "react-toastify";

import { timeout } from "../components/helper/timeOut";
import Spinner from "../components/Spinner";
import Error from "../components/Error";
import {
  SETTIMEOUT_SEC,
  TIMEOUT_SEC,
} from "../components/helper/helper_variable";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "users", params.landlordId);

        const docSnap = await Promise.race([
          timeout(TIMEOUT_SEC),
          getDoc(docRef),
        ]);

        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        } else {
          toast.error("Could not contact Landlord");
        }
      } catch (error) {
        if (error.message.includes("Request took too long")) {
          setErrorMessage(`${error.message}`);
          toast.error("Service timeout. Check your internet connection");
        }
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), SETTIMEOUT_SEC * 1000);
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);

  if (loading) {
    return <Spinner />;
  }

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  return (
    <div className='container'>
      <div className='pageContainer '>
        <header>
          <p className='pageHeader'>Contact Landlord</p>
        </header>

        {landlord !== null && (
          <main>
            <div className='contactLandlord'>
              <p className='landlordName'>Contact {landlord?.name}</p>
            </div>

            <form className='messageForm'>
              <div className='messageDiv'>
                <label htmlFor='message' className='messageLabel'>
                  Message
                </label>
                <textarea
                  name='message'
                  id='message'
                  value={message}
                  className='textarea'
                  onChange={onChange}
                ></textarea>
              </div>
            </form>
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button className='primaryButton btn' type='button'>
                Send Message
              </button>
            </a>
          </main>
        )}
      </div>
    </div>
  );
}

export default Contact;
