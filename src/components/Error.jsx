import React from "react";

function Error({ errorMessage }) {
  if (errorMessage.includes("Request")) {
    return (
      <div className='errorContainer'>
        <p className='errorDetail'>
          <span>🚨</span>Check your internet connection!!!
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <span>🚨</span>
        <p className='errorDetail'>Something went wrong!!!</p>
      </div>
    );
  }
}

export default Error;
