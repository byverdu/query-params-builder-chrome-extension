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
      getCurrentTab()
        .then(([tab]) => {
          sendResponse(tab);
        })
        .catch(error => error);

      return true;
    }

    if (msg.type === actions.UPDATE_URL_TAB) {
      updateUrlTab(msg.payload)
        .then(tab => tab)
        .catch(error => error);

      return true;
    }
  }
});
