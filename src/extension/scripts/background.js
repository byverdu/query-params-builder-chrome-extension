/// <reference path="../../types/index.d.ts" />
import {
  extensionApi,
  GET_CURRENT_TAB,
  SET_STORAGE,
  GET_STORAGE,
  UPDATE_URL_TAB,
  REMOVE_ALL_STORAGE,
  TABS_ITEM,
  OPTIONS_ITEM,
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
 * @param {SyncStorage} values
 */
async function setStorageAsync(key, values) {
  await setStorage(key, values);
}

/**
 * @param {(response: SyncStorage) => void} sendResponse
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

/**
 *
 * @param {SendMsgParams} msg
 * @param {chrome.runtime.MessageSender} sender
 * @param {(response: unknown) => void} sendResponse
 * @returns void
 */
function onMessageCallback(msg, sender, sendResponse) {
  if (sender && msg && msg.type) {
    if (msg.type === SET_STORAGE) {
      /**
       * @type {SendMsgPayload<SyncStorage>}
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
  } else {
    console.info(`No messages found for ${OPTIONS_ITEM}`);
  }
}

/**
 * @param {SyncStorage} data
 * @param {number} tabId
 */
function setStorageSyncCallback(data, tabId) {
  const savedTabs = data[TABS_ITEM];

  if (savedTabs) {
    const newTabs = Object.keys(savedTabs).reduce((prev, curr) => {
      if (Number(curr) !== tabId) {
        prev[curr] = savedTabs[curr];
      }

      return {
        ...prev,
      };
    }, {});

    setStorageSync(TABS_ITEM, newTabs);
  }
}

/**
 * @param {number} tabId
 */
function onRemovedTabHandler(tabId) {
  getStorageSync(TABS_ITEM, data => setStorageSyncCallback(data, tabId));
}

onMessage(onMessageCallback);
onRemovedTab(onRemovedTabHandler);
