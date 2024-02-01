import React from "react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";

function CreatingListing() {
  const [loading, setLoading] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    address: "",
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
    address,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log(formData);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    // let geolocation = {};
    // let location;

    // if (geolocationEnabled) {
    //   const response = await fetch(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAj1lg0Thhg1wWSABx9pe61HJteo4ysLII`
    //   );
    //   const data = await response.json();
    //   console.log(data);

    //   geolocation.lat = data.results[0].geometry.location.lat ?? 0;
    //   geolocation.lng = data.results[0].geometry.location.lng ?? 0;
    // } else {
    //   geolocation.lat = latitude;
    //   geolocation.lng = longitude;
    //   location = address;
    // }

    // store image in firebase

    const storageImage = async (image) => {
      return new Promise((resolve, reject) => {
        let recievedData;
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);

        console.log(storageRef);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
            throw error;
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
              recievedData = downloadURL;
            });
          }
        );
        return recievedData;
      });
    };

    debugger;
    const imgUrls = await Promise.all(
      [...images].map((image) => storageImage(image))
    )
      .then(() => {
        toast.success("good");
      })
      .catch(() => {
        setLoading(false);
        toast.error("Images not uploaded");
      });

    console.log(imgUrls);
    console.log(images);

    setLoading(false);
  };

  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Booleans /NUmber
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor='form' className='formLabel'>
            Sell/ Rent
          </label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label htmlFor='name' className='formLabel'>
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
            className='formInputName'
          />
          <div className='formRooms flex'>
            <div>
              <label htmlFor='bedrooms' className='formLabel'>
                Bedrooms
              </label>
              <input
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min={1}
                max={50}
                required
                className='formInputSmall'
              />
            </div>

            <div>
              <label htmlFor='bathrooms' className='formLabel'>
                Bathrooms
              </label>
              <input
                type='number'
                className='formInputSmall'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min={1}
                max={50}
                required
              />
            </div>
          </div>

          <label htmlFor='parking' className='formLabel'>
            Parking spot
          </label>
          <div className='formButtons'>
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min={1}
              max={50}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === "rent" && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            // accept='images/png, images/jpeg'
            accept='image/*'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreatingListing;
