import {
  extensionApi,
  GET_CURRENT_TAB,
  SET_STORAGE,
  GET_STORAGE,
  UPDATE_URL_TAB,
  REMOVE_ALL_STORAGE,
  TABS_ITEM,
} from '../utils/api.js';

const {
  onMessage,
  getStorage,
  setStorage,
  getCurrentTab,
  updateUrlTab,
  removeStorage,
  onRemovedTab,
  getStorageSync,
  setStorageSync,
} = extensionApi;

/**
 * @param {ExtensionItems} key
 * @param {SetStorage} values
 */
async function setStorageAsync(key, values) {
  await setStorage(key, values);
}

/**
 * @param {(response: ExtensionProps[]) => void} sendResponse
 * @param {ExtensionItems} key
 */
async function getStorageAsync(sendResponse, key) {
  const items = await getStorage(key);

  sendResponse(items[key]);
}

/**
 * @param {(resp: chrome.tabs.Tab) => void} sendResponse
 */
async function getCurrentTabAsync(sendResponse) {
  const [tab] = await getCurrentTab();

  sendResponse(tab);
}

/**
 * @param {(resp: chrome.tabs.Tab) => void} sendResponse
 * @param {string} url
 */
async function updateUrlTabAsync(sendResponse, url) {
  const tab = await updateUrlTab(url);

  sendResponse(tab);
}

/**
 * @param {ExtensionItems[]} key
 */
async function removeStorageAsync(key) {
  await removeStorage(key);
}

onMessage((msg, sender, sendResponse) => {
  if (sender && msg && msg.type) {
    if (msg.type === SET_STORAGE) {
      /**
       * @type {SendMsgPayload<SetStorage>}
       */
      const { key, value } = msg.payload;
      setStorageAsync(key, value);
    }

    if (msg.type === GET_STORAGE) {
      /**
       * @type {SendMsgPayload<ExtensionItems>}
       */
      const { value } = msg.payload;
      getStorageAsync(sendResponse, value);

      // make it asynchronously by returning true
      return true;
    }

    if (msg.type === GET_CURRENT_TAB) {
      getCurrentTabAsync(sendResponse);

      return true;
    }

    if (msg.type === UPDATE_URL_TAB) {
      /**
       * @type {SendMsgPayload<string>}
       */
      const { value } = msg.payload;
      updateUrlTabAsync(sendResponse, value);

      return true;
    }

    if (msg.type === REMOVE_ALL_STORAGE) {
      /**
       * @type {SendMsgPayload<ExtensionItems[]>}
       */
      const { value } = msg.payload;
      removeStorageAsync(value);
    }
  }
});

/**
 * @param {number} tabId
 */
function onCloseTabHandler(tabId) {
  /**
   * @type {GetStorageSyncCallback}
   */
  const callback = function (data) {
    const savedTabs = data[TABS_ITEM];
    const newTabs = Object.keys(savedTabs).reduce((prev, curr) => {
      if (Number(curr) !== tabId) {
        prev[curr] = savedTabs[curr];
      }

      return {
        ...prev,
      };
    }, {});

    setStorageSync(TABS_ITEM, newTabs);
  };
  getStorageSync(TABS_ITEM, callback);
}

onRemovedTab(onCloseTabHandler);
