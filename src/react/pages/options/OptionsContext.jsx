import React, { createContext, useEffect, useRef } from 'react';

import {
  extensionApi,
  SET_STORAGE,
  GET_STORAGE,
  OPTIONS_ITEM,
  REMOVE_ALL_STORAGE,
  TABS_ITEM,
} from '../../../extension/utils/api.js';
import {
  sendMessageCatchHandler,
  sendMessageAsyncHandler,
} from '../../utils/index.js';

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
 */
export const OptionsProvider = ({
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
      case 'updateOption':
      case 'deleteOption':
        sendMessageAsyncHandler(
          sendMessage({
            type: SET_STORAGE,
            payload: { key: OPTIONS_ITEM, value: options },
          }),
          setToast,
          text,
          updateAction
        );
        return;
      case 'deleteAll':
        sendMessageAsyncHandler(
          sendMessage({
            type: REMOVE_ALL_STORAGE,
            payload: { value: [OPTIONS_ITEM, TABS_ITEM] },
          }),
          setToast,
          text,
          updateAction
        );
        return;
      default:
        return;
    }
  }, [updateAction, options, setToast]);

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
