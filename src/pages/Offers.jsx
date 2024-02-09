import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import ListingItem from "../components/ListingItem";
import Error from "../components/Error";
import {
  SETTIMEOUT_SEC,
  TIMEOUT_SEC,
} from "../components/helper/helper_variable";
import { timeout } from "../components/helper/timeOut";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const params = useParams();

  // Fetching Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listing");

        // Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await Promise.race([
          timeout(TIMEOUT_SEC),
          getDocs(q),
        ]);

        // for pagination
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
      } catch (error) {
        console.error(error);
        if (error.message.includes("Request took too long")) {
          toast.error("Bad internet connection");
          setErrorMessage(error.message);
        } else {
          toast.error("Could not fetch listings");
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, SETTIMEOUT_SEC * 1000);
      }
    };

    fetchListings();
  }, []);

  // fetching pagination listing
  const onfetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, "listing");

      // Create a query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute query

      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {errorMessage && <Error errorMessage={errorMessage} />}

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />

          {/* {lastFetchedListing && (
            <p className='loadMore' onClick={() => onfetchMoreListings()}>
              Load More
            </p>
          )} */}
        </>
      ) : (
        <p> There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
