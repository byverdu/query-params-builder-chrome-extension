import React, { useEffect, useRef, useContext } from 'react';
import { OptionContext } from '../pages/options/index.jsx';

export const Toast = () => {
  const toast = useRef(null);
  const {
    toast: { type, text },
    options,
  } = useContext(OptionContext);
  const headerText = {
    success: 'Success!',
    danger: 'Error!',
  }[type];

  useEffect(() => {
    if (toast.current && type && text) {
      new bootstrap.Toast(toast.current, {
        animation: true,
        autohide: true,
        delay: 3000,
      }).show();
    }
  }, [type, text, options]);

  return (
    <div
      ref={toast}
      className="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <span className={`badge me-auto text-bg-${type}`}>{headerText}</span>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{text}</div>
    </div>
  );
};
