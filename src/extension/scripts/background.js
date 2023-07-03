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
 * @param {(response: import('../types/index.js').ExtensionOptions[]) => void} sendResponse
 * @param {import('../types/index.js').ExtensionItems} key
 */
async function getStorageAsync(sendResponse, key) {
  const items = await getStorage(key);

  sendResponse(items[key]);
}

/**
 * @param {import('../types/index.js').ExtensionItems} key
 * @param {import('../types/index.js').ExtensionOptions[]} values
 */
async function setStorageAsync(key, values) {
  await setStorage(key, values);
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
 * @param {import('../types/index.js').ExtensionItems} key
 */
async function removeStorageAsync(key) {
  await removeStorage(key);
}

onMessage((msg, sender, sendResponse) => {
  if (sender && msg && msg.type) {
    if (msg.type === SET_STORAGE) {
      setStorageAsync(msg.payload.key, msg.payload.value);
    }

    if (msg.type === GET_STORAGE) {
      getStorageAsync(sendResponse, msg.payload.key);

      // make it asynchronously by returning true
      return true;
    }

    if (msg.type === GET_CURRENT_TAB) {
      getCurrentTabAsync(sendResponse);

      return true;
    }

    if (msg.type === UPDATE_URL_TAB) {
      updateUrlTabAsync(sendResponse, msg.payload.value);

      return true;
    }

    if (msg.type === REMOVE_ALL_STORAGE) {
      removeStorageAsync(msg.payload.value);
    }
  }
});

/**
 * @param {number} tabId
 */
function onCloseTabHandler(tabId) {
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
