import { extensionApi, actions, logger } from '../../utils/api.js';
import { popupOptionsBuilder } from '../../utils/DOMHelpers.js';

const { sendMessage } = extensionApi;

async function applyParamsToUrl() {
  try {
    const currentTab = await sendMessage({ type: actions.GET_CURRENT_TAB });
    const { url: defaultUrl } = currentTab;
    const url = new URL(defaultUrl);
    const urlParams = new URLSearchParams('');

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

    await sendMessage({
      type: actions.UPDATE_URL_TAB,
      payload: `${url.origin}${url.pathname}?${urlParams.toString()}`,
    });
  } catch (error) {
    logger('error', 'getTab', String(error));
  }
}

async function restoreOptions() {
  try {
    const options = await sendMessage({ type: actions.GET_OPTIONS });

    if (options && Array.isArray(options)) {
      popupOptionsBuilder(options, document.getElementById('selected_bundles'));

      const currentTab = await sendMessage({ type: actions.GET_CURRENT_TAB });
      const { url: defaultUrl } = currentTab;
      const url = new URL(defaultUrl);

      if (url.search.length > 0) {
        const urlParams = new URLSearchParams(url.search);

        for (const [key, value] of urlParams.entries()) {
          const checkbox = document.querySelector(`input[value="${key}"]`);
          const inputField = document.querySelector(
            `input[data-id="${checkbox.id}"]`
          );

          checkbox.checked = true;
          inputField.value = value;
        }
      }
    }
  } catch (error) {
    logger('error', 'getOptions', String(error));
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document
  .getElementById('applyParams')
  .addEventListener('click', applyParamsToUrl);
