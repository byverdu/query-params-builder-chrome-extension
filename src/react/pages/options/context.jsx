import React, { createContext, useEffect, useRef } from 'react';

import {
  extensionApi,
  SET_STORAGE,
  GET_STORAGE,
  OPTIONS_ITEM,
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
  updateAction: undefined,
  setUpdateAction: () => {},
};

export const OptionContext = createContext(initialContext);

/**
 *
 * @param {OptionsContext & {children: React.ReactElement}} props
 * @returns
 */
export const AppProvider = ({
  children,
  options,
  setOptions,
  toast,
  setToast,
  updateAction,
  setUpdateAction,
}) => {
  const optionsToFetch = useRef(true);

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
  }, [setOptions, setToast]);

  useEffect(() => {
    const text = {
      saveNewOption: 'New option saved Successfully',
      updateOption: 'Option updated Successfully',
      deleteOption: 'Option deleted Successfully',
      deleteAll: 'All options deleted Successfully',
    }[updateAction];

    switch (updateAction) {
      case 'saveNewOption':
        sendMessage({
          type: SET_STORAGE,
          payload: { key: OPTIONS_ITEM, value: options },
        })
          .then(() => {
            setToast({ type: 'success', text });
          })
          .catch(error =>
            sendMessageCatchHandler(setToast, error, updateAction)
          );
    }
  }, [updateAction, setToast, options]);

  return (
    <OptionContext.Provider
      value={{
        toast,
        setToast,
        options,
        setOptions,
        updateAction,
        setUpdateAction,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
};
