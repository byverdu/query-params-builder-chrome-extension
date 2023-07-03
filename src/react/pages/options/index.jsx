/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';
import { Options } from './Options.jsx';

import {
  extensionApi,
  SET_STORAGE,
  GET_STORAGE,
  REMOVE_ALL_STORAGE,
  OPTIONS_ITEM,
  TABS_ITEM,
} from '../../../extension/utils/api.js';
import { sendMessageCatchHandler } from '../../utils/index.js';

/**
 * @type {import('../../../extension/types/index.js').API}
 */
const { sendMessage } = extensionApi;

const initialToast = {
  type: undefined,
  text: undefined,
};

/**
 * @type {import('../../../extension/types/index.js').OptionsContext}
 */
const initialContext = {
  toast: {
    ...initialToast,
  },
  setToast: () => {},
  options: [],
  setOptions: () => {},
  updateOptions: () => {},
};

export const AppContext = createContext(initialContext);

const AppProvider = ({ children }) => {
  const [toast, setToast] = useState(initialToast);
  const [options, setOptions] = useState([]);
  const optionsToFetch = useRef(true);
  /**
   * @type {import('../../../extension/types/index.js').UpdateOptionsParams}
   */
  const updateOptions = (value, actionType) => {
    const toastText = {
      saveNewOption: 'New option saved Successfully',
      updateOption: 'Option updated Successfully',
      deleteOption: 'Option deleted Successfully',
      deleteAll: 'All options deleted Successfully',
    }[actionType];

    if (actionType === 'deleteAll') {
      sendMessage({
        type: REMOVE_ALL_STORAGE,
        payload: { value: [OPTIONS_ITEM, TABS_ITEM] },
      })
        .then(() => {
          setToast({ type: 'success', text: toastText });
        })
        .catch(error => sendMessageCatchHandler(setToast, error, actionType));
    }

    sendMessage({
      type: SET_STORAGE,
      payload: { key: OPTIONS_ITEM, value },
    })
      .then(() => {
        setOptions(value);
        setToast({ type: 'success', text: toastText });
      })
      .catch(error => sendMessageCatchHandler(setToast, error, actionType));
  };

  useEffect(() => {
    if (optionsToFetch.current) {
      sendMessage({
        type: GET_STORAGE,
        payload: {
          key: OPTIONS_ITEM,
        },
      })
        .then(resp => {
          const validateResponse = Array.isArray(resp) ? resp : [];
          setOptions(validateResponse);
          setToast({ type: 'success', text: 'Options Restored Successfully' });
        })
        .catch(error => sendMessageCatchHandler(setToast, error, GET_STORAGE));
    }

    return () => {
      optionsToFetch.current = false;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        toast,
        setToast,
        options,
        setOptions,
        updateOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <Options />
  </AppProvider>
);

// AppProvider.propTypes = {
//   children: PropTypes.element.isRequired,
// };
