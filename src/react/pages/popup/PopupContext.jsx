import React, { createContext, useEffect, useRef } from 'react';
import { extensionApi, GET_CURRENT_TAB } from '../../../extension/utils/api.js';
import { fetchTabStorage } from '../../utils/index.js';

/**
 * @type {API}
 */
const { sendMessage } = extensionApi;

/**
 * @type {PopupContext}
 */
const initialContext = {
  currentTab: null,
  setCurrentTab: () => null,
  options: null,
  setOptions: () => null,
  updateAction: undefined,
  setUpdateAction: () => null,
};
export const PopupContext = createContext(initialContext);

/**
 *
 * @param {PopupContext & {children: React.ReactElement}} props
 */
export const PopupProvider = ({
  children,
  currentTab,
  setCurrentTab,
  options,
  setOptions,
  updateAction,
  setUpdateAction,
}) => {
  const optionsToFetch = useRef(true);

  useEffect(() => {
    sendMessage({ type: GET_CURRENT_TAB })
      .then(tab => setCurrentTab(tab))
      .catch(error =>
        console.error(
          `QueryParamsBuilder extension GET_CURRENT_TAB`,
          String(error)
        )
      );
  }, [setCurrentTab]);

  useEffect(() => {
    if (currentTab) {
      fetchTabStorage(currentTab.url)
        .then(resp => {
          // console.log('fetchTabStorage resp => ', resp);

          const validateResponse = Array.isArray(resp) ? resp : [];
          setOptions(validateResponse);
        })
        .catch(error =>
          console.error(
            `QueryParamsBuilder extension GET_STORAGE`,
            String(error)
          )
        );
    } else {
      setOptions([]);
    }

    return () => {
      optionsToFetch.current = false;
    };
  }, [currentTab, setOptions]);

  return (
    <PopupContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        options,
        setOptions,
        updateAction,
        setUpdateAction,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
