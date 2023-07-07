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
  setToast({ type: 'danger', text: error.message });
};

/**
 *
 * @param {string} tabUrl
 * @returns {Promise<OptionsExtensionProps[] | BaseExtensionProps[]>}
 */
const fetchTabStorage = async tabUrl => {
  // const tabUrl = currentTab && currentTab.url;
  /**
   * @type {{[key: string]: OptionsExtensionProps[]}}
   */
  const tabs = await sendMessage({
    type: GET_STORAGE,
    payload: { key: TABS_ITEM },
  });

  /**
   * @type {BaseExtensionProps[]}
   */
  const options = await sendMessage({
    type: GET_STORAGE,
    payload: { key: OPTIONS_ITEM },
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

export { sendMessageCatchHandler, fetchTabStorage };
