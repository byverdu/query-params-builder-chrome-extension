import {
  extensionApi,
  GET_CURRENT_TAB,
  SET_STORAGE,
  GET_STORAGE,
  UPDATE_URL_TAB,
  REMOVE_ALL_STORAGE,
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

async function getStorageAsync(sendResponse, key) {
  const items = await getStorage(key);

  sendResponse(items[key]);
}

async function setStorageAsync(key, values) {
  await setStorage(key, values);
}

async function getCurrentTabAsync(sendResponse) {
  const [tab] = await getCurrentTab();

  sendResponse(tab);
}

async function updateUrlTabAsync(sendResponse, url) {
  const tab = await updateUrlTab(url);

  sendResponse(tab);
}

async function removeStorageAsync(key) {
  await removeStorage(key);
}

onMessage((msg, sender, sendResponse) => {
  if (sender && msg && msg.type) {
    if (msg.type === SET_STORAGE) {
      setStorageAsync(msg.payload.key, msg.payload.value);
    }

    if (msg.type === GET_STORAGE) {
      getStorageAsync(sendResponse, msg.payload);

      // make it asynchronously by returning true
      return true;
    }

    if (msg.type === GET_CURRENT_TAB) {
      getCurrentTabAsync(sendResponse);

      return true;
    }

    if (msg.type === UPDATE_URL_TAB) {
      updateUrlTabAsync(sendResponse, msg.payload);

      return true;
    }

    if (msg.type === REMOVE_ALL_STORAGE) {
      removeStorageAsync(msg.payload);
    }
  }
});

function onCloseTabHandler(tabId) {
  const callback = function (data) {
    const savedTabs = data['QueryParamsBuilderTab'];
    const newTabs = Object.keys(savedTabs).reduce((prev, curr) => {
      if (Number(curr) !== tabId) {
        prev[curr] = savedTabs[curr];
      }

      return {
        ...prev,
      };
    }, {});

    setStorageSync('QueryParamsBuilderTab', newTabs);
  };
  getStorageSync('QueryParamsBuilderTab', callback);
}

onRemovedTab(onCloseTabHandler);
