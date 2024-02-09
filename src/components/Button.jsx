import React, { Children } from "react";

function Button({ children, onSubmit, btnDisabled }) {
  return (
    <button
      type='submit'
      className='primaryButton btn'
      onClick={onSubmit}
      disabled={btnDisabled}
    >
      {children}
    </button>
  );
}

export default Button;
