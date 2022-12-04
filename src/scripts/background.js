import { extensionApi, actions } from '../utils/api.js';

const {
  onMessage,
  getStorage,
  setStorage,
  getCurrentTab,
  updateUrlTab,
  removeStorage,
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
    if (msg.type === actions.SET_STORAGE) {
      setStorageAsync(msg.payload.key, msg.payload.value);
    }

    if (msg.type === actions.GET_STORAGE) {
      getStorageAsync(sendResponse, msg.payload);

      return true;
    }

    if (msg.type === actions.GET_CURRENT_TAB) {
      getCurrentTabAsync(sendResponse);

      return true;
    }

    if (msg.type === actions.UPDATE_URL_TAB) {
      updateUrlTabAsync(sendResponse, msg.payload);

      return true;
    }

    if (msg.type === actions.REMOVE_ALL_STORAGE) {
      removeStorageAsync(msg.payload);
    }
  }
});
