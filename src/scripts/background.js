import { extensionApi, actions } from '../utils/api.js';

const { onMessage, getStorage, setStorage } = extensionApi;

onMessage((msg, sender, sendResponse) => {
  console.log(sender);
  if (msg && msg.type) {
    if (msg.type === actions.SET_OPTIONS) {
      setStorage('QueryParamsBuilder', msg.payload)
        .then(() => console.log('QueryParamsBuilder extension saved'))
        .catch(error =>
          console.error('QueryParamsBuilder extension saved error', error)
        );
    }

    if (msg.type === actions.GET_OPTIONS) {
      getStorage('QueryParamsBuilder')
        .then(items => {
          sendResponse(items['QueryParamsBuilder']);
        })
        .catch(error =>
          console.error('mol-fe-params extension get options error', error)
        );

      return true;
    }
  }
});
