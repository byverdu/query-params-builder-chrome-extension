import { extensionApi, actions, logger } from '../utils/api.js';

const { onMessage, getStorage, setStorage, getCurrentTab, updateUrlTab } =
  extensionApi;

onMessage(async (msg, sender, sendResponse) => {
  console.log(sender);
  if (msg && msg.type) {
    if (msg.type === actions.SET_OPTIONS) {
      setStorage('QueryParamsBuilderOptions', msg.payload)
        .then(() => logger('log', 'setOptions', 'OK!'))
        .catch(error => error);
    }

    if (msg.type === actions.GET_OPTIONS) {
      getStorage('QueryParamsBuilderOptions')
        .then(items => {
          sendResponse(items['QueryParamsBuilderOptions']);
        })
        .catch(error => error);

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
