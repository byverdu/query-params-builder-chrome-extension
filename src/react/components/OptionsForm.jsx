import React, { useCallback, useContext } from 'react';
import { OptionContext } from '../pages/options/context.jsx';

const inputs = [
  {
    id: 'bundleName',
    placeholder: 'i.e. API Key',
    text: 'Param Description',
  },
  { id: 'urlParamKey', placeholder: 'i.e. apiKey', text: 'Url param key' },
];

export const OptionsForm = () => {
  const { updateOptions, options } = useContext(OptionContext);
  const onSubmitHandler = useCallback(
    e => {
      e.preventDefault();

      const elements = e.target.elements || [];
      const option = {
        checked: false,
        canDeleteFromPopup: false,
        id: crypto.randomUUID(),
      };

      for (const elem of elements) {
        if (elem.nodeName === 'INPUT') {
          option[elem.id] = elem.value;

          // remove old value
          elem.value = '';
        }
      }

      updateOptions([...options, option], 'saveNewOption');
    },
    [updateOptions, options]
  );

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
