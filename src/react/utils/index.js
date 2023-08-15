/// <reference path="../../types/index.d.ts" />

import {
  extensionApi,
  GET_STORAGE,
  OPTIONS_ITEM,
  TABS_ITEM,
} from '../../extension/utils/api.js';

/**
 * @type {API}
 */
const { sendMessage } = extensionApi;

/**
 * @param {React.Dispatch<React.SetStateAction<Toast>>} setToast
 * @param {Error} error
 * @param {UpdateActions | ExtensionActions} type
 */
const sendMessageCatchHandler = (setToast, error, type) => {
  console.error(`QueryParamsBuilder extension ${type}`, String(error));
  setToast({ type: 'danger', text: `${type}: ${error.message}` });
};

/**
 *
 * @param {Promise} promise
 * @param {React.Dispatch<React.SetStateAction<Toast>>} setToast
 * @param {string} text
 * @param {UpdateActions | ExtensionActions} type
 */
const sendMessageAsyncHandler = (promise, setToast, text, type) => {
  promise
    .then(() => {
      setToast({ type: 'success', text });
    })
    .catch(error => {
      console.error(`QueryParamsBuilder extension ${type}`, String(error));
      setToast({
        type: 'danger',
        text: `${type}: ${error.message}`,
      });
    });
};

/**
 *
 * @param {string | null} tabUrl
 * @returns {Promise<OptionsExtensionProps[] | BaseExtensionProps[]>}
 */
const fetchTabStorage = async tabUrl => {
  /**
   * @type {{[key: string]: OptionsExtensionProps[]}}
   */
  const tabs = await sendMessage({
    type: GET_STORAGE,
    payload: { value: TABS_ITEM },
  });

  /**
   * @type {BaseExtensionProps[]}
   */
  const options = await sendMessage({
    type: GET_STORAGE,
    payload: { value: OPTIONS_ITEM },
  });

  const validOptions = options && Array.isArray(options) ? options : [];
  const savedTabInfo = tabs && tabs[tabUrl];

  if (!savedTabInfo) {
    return validOptions;
  }

  const validTabsInfo =
    savedTabInfo && Array.isArray(savedTabInfo) ? savedTabInfo : [];

  for (const option of validOptions) {
    if (!validTabsInfo.find(item => item.id === option.id)) {
      validTabsInfo.push(option);
    }
  }

  return validTabsInfo;
};

/**
 * @param {BaseExtensionProps[]} prevState
 * @param {BaseExtensionProps} newValue
 * @returns
 */
const updateState = (prevState, newValue) => {
  if (Array.isArray(prevState)) {
    return [...prevState, newValue];
  }

  return prevState;
};

/**
 * @param {BaseExtensionProps[]} prevState
 * @param {string} id
 * @returns
 */
const removeItemFromState = (prevState, id) => {
  if (Array.isArray(prevState) && typeof id === 'string') {
    return prevState.filter(item => item.id !== id);
  }

  return prevState;
};

/**
 * @param {BaseExtensionProps[]} prevState
 * @param {{id: string, key: string, value: string}} id
 * @returns
 */
const editItemFromState = (prevState, { id, key, value }) => {
  if (Array.isArray(prevState) && id && typeof id === 'string') {
    return prevState.map(item => {
      if (item.id === id) {
        item[key] = value;
      }

      return item;
    });
  }

  return prevState;
};

/**
 *
 * @param {"options" | "popup"} type
 * @param {HTMLFormControlsCollection} elements
 */
const getNewItemToSave = (type, elements) => {
  const canDeleteFromPopup = type === 'popup';
  const newItem = {
    checked: false,
    canDeleteFromPopup,
    id: crypto.randomUUID(),
  };

  for (const elem of elements) {
    if (elem.nodeName === 'INPUT') {
      newItem[elem.id] = elem.value;

      // remove old value
      elem.value = '';
    }
  }

  return newItem;
};

export {
  sendMessageCatchHandler,
  fetchTabStorage,
  sendMessageAsyncHandler,
  updateState,
  getNewItemToSave,
  removeItemFromState,
  editItemFromState,
};
