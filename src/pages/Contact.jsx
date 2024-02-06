import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      try {
        const docRef = doc(db, "users", params.landlordId);
        
        const docSnap = await getDoc(docRef);

        
        if (docSnap.exists()) {
          setLandlord(docSnap.data());
        } else {
          toast.error("Could not contact Landlord");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className='pageContainer'>
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
            <button className='primaryButton' type='button'>
              Send Message
            </button>
          </a>
        </main>
      )}
    </div>
  );
}

export default Contact;
