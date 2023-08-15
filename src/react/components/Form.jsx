import React, { useCallback } from 'react';

const inputs = [
  {
    id: 'bundleName',
    placeholder: 'i.e. API Key',
    text: 'Param Description',
  },
  { id: 'urlParamKey', placeholder: 'i.e. apiKey', text: 'Url param key' },
];

/**
 *
 * @param {FormProps} props
 * @returns {React.JSX.Element}
 */
export const Form = ({ onSubmitHandler }) => {
  const onInvalidHandler = useCallback(e => {
    e.preventDefault();

    const elem = e.target;

    if (elem && !elem.validity.valid) {
      elem.classList.add('is-invalid');
      elem.placeholder = 'This value can not be empty';
    }
  }, []);

  return (
    <form className="row gy-3" onSubmit={onSubmitHandler}>
      {inputs.map(({ id, placeholder, text }) => (
        <div key={id} className="col-sm-12 col-md-6">
          <label htmlFor={id} className="form-label">
            {text}
          </label>
          <input
            onInvalid={onInvalidHandler}
            required
            type="text"
            className="form-control"
            id={id}
            placeholder={placeholder}
          />
        </div>
      ))}
      <div className="col-2">
        <button
          id="addBundle"
          style={{ width: '100%' }}
          type="submit"
          className="btn btn-outline-primary"
        >
          Add Bundle
        </button>
      </div>
    </form>
  );
};
