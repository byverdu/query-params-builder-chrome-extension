import { extensionApi, actions } from '../../utils/api.js';
import { popupOptionsBuilder } from '../../utils/DOMHelpers.js';

const { sendMessage } = extensionApi;

function applyParamsToUrl() {
  sendMessage({ type: actions.GET_CURRENT_TAB }).then(tab => {
    const { url: defaultUrl } = tab;
    const url = new URL(defaultUrl);
    const urlParams = new URLSearchParams(url.search);

    if (url) {
      document.querySelectorAll('input:checked').forEach(input => {
        const bundleId = input.id;
        const bundleValue = document.querySelector(
          `[data-id="${bundleId}"]`
        ).value;
        const key = input.value;
        urlParams.append(key, bundleValue);
      });
    }

    sendMessage({
      type: actions.UPDATE_URL_TAB,
      payload: `${url.href}?${urlParams.toString()}`,
    });
  });
}

function restoreOptions() {
  sendMessage({ type: actions.GET_OPTIONS })
    .then(resp => {
      if (resp && Array.isArray(resp)) {
        console.log(resp);
        popupOptionsBuilder(resp, document.getElementById('selected_bundles'));
      }
    })
    .catch(e => {
      console.error(e);
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document
  .getElementById('applyParams')
  .addEventListener('click', applyParamsToUrl);
