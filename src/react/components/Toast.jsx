import React, { useEffect, useRef, useContext } from 'react';
import { OptionContext } from '../pages/options/OptionsContext.jsx';

export const Toast = () => {
  /**
   * @type {React.MutableRefObject<HTMLDivElement | null>}
   */
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
      toast.current.classList.add('show');

      setTimeout(() => {
        toast.current.classList.remove('show');
      }, 3000);
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
