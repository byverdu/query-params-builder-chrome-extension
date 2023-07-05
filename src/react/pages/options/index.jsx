import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
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
 * @type {API}
 */
const { sendMessage } = extensionApi;

/**
 * @type {Toast}
 */
const initialToast = {
  type: undefined,
  text: undefined,
};

/**
 * @type {OptionsContext}
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

export const OptionContext = createContext(initialContext);

const AppProvider = ({ children }) => {
  /**
   * @type {UseState<Toast>}
   */
  const [toast, setToast] = useState(initialToast);
  /**
   * @type {UseState<ExtensionProps[]>}
   */
  const [options, setOptions] = useState([]);
  const optionsToFetch = useRef(true);

  /**
   * @type {OptionsContext['updateOptions']}
   */
  const updateOptions = useCallback(
    (value, actionType) => {
      /**
       * @type {{[key in UpdateActions]: string}}
       */
      const toastText = {
        saveNewOption: 'New option saved Successfully',
        updateOption: 'Option updated Successfully',
        deleteOption: 'Option deleted Successfully',
        deleteAll: 'All options deleted Successfully',
      };
      const text = toastText[actionType];

      if (actionType === 'deleteAll') {
        sendMessage({
          type: REMOVE_ALL_STORAGE,
          payload: { value: [OPTIONS_ITEM, TABS_ITEM] },
        })
          .then(() => {
            setToast({ type: 'success', text });
          })
          .catch(error => sendMessageCatchHandler(setToast, error, actionType));
      }

      sendMessage({
        type: SET_STORAGE,
        payload: { key: OPTIONS_ITEM, value },
      })
        .then(() => {
          setOptions(value);
          setToast({ type: 'success', text });
        })
        .catch(error => sendMessageCatchHandler(setToast, error, actionType));
    },
    [setToast, setOptions]
  );

  useEffect(() => {
    if (optionsToFetch.current) {
      sendMessage({
        type: GET_STORAGE,
        payload: {
          value: OPTIONS_ITEM,
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
    <OptionContext.Provider
      value={{
        toast,
        setToast,
        options,
        setOptions,
        updateOptions,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <Options />
  </AppProvider>
);
