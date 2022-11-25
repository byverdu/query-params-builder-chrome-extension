import { extensionApi, actions } from '../utils/api.js';

const { onMessage, getStorage, setStorage, getCurrentTab, updateUrlTab } =
  extensionApi;

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

onMessage((msg, sender, sendResponse) => {
  console.log(sender);
  if (msg && msg.type) {
    if (msg.type === actions.SET_OPTIONS) {
      setStorageAsync('QueryParamsBuilderOptions', msg.payload);
    }

    if (msg.type === actions.GET_OPTIONS) {
      getStorageAsync(sendResponse, 'QueryParamsBuilderOptions');

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
  }
});
