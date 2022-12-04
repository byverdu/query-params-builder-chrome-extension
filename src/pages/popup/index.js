import { extensionApi, actions } from '../../utils/api.js';
import { popupOptionsBuilder } from '../../utils/DOMHelpers.js';

const { sendMessage } = extensionApi;

async function applyParamsToUrl() {
  try {
    const currentTab = await sendMessage({ type: actions.GET_CURRENT_TAB });

    const { url: defaultUrl } = currentTab;
    const url = new URL(defaultUrl);
    const urlParams = new URLSearchParams(url.search || '');
    const tabInfoToSave = [];

    if (url) {
      /**
       * @type HTMLInputElement[]
       */
      const checkboxes = Array.from(
        document.querySelectorAll('input[type="checkbox"]')
      );

      for (const input of checkboxes) {
        // delete all to update only with checked ones
        urlParams.delete(input.value);

        const bundleId = input.id;
        const urlParamKey = input.value;
        const urlParamValue = document.querySelector(
          `[data-id="${bundleId}"]`
        ).value;
        const bundleName = input.dataset.bundleName;

        if (input.checked) {
          urlParams.append(urlParamKey, urlParamValue);
        }

        tabInfoToSave.push({
          id: bundleId,
          checked: input.checked,
          urlParamKey,
          bundleName,
          urlParamValue,
        });
      }

      const initialUrl = `${url.origin}${url.pathname}`;
      const updatedUrl =
        urlParams.toString().length > 0
          ? `${initialUrl}?${urlParams.toString()}`
          : initialUrl;

      const updatedTab = await sendMessage({
        type: actions.UPDATE_URL_TAB,
        payload: updatedUrl,
      });

      await sendMessage({
        type: actions.SET_STORAGE,
        payload: {
          key: 'QueryParamsBuilderTab',
          value: {
            [updatedTab.id]: tabInfoToSave,
          },
        },
      });
    }
  } catch (error) {
    console.error(`QueryParamsBuilder extension getTab`, String(error));
  }
}

async function restoreOptions() {
  try {
    const currentTab = await sendMessage({ type: actions.GET_CURRENT_TAB });
    const savedTabInfo = await sendMessage({
      type: actions.GET_STORAGE,
      payload: 'QueryParamsBuilderTab',
    });
    const options = await sendMessage({
      type: actions.GET_STORAGE,
      payload: 'QueryParamsBuilderOptions',
    });
    const result = [];

    if (
      savedTabInfo &&
      savedTabInfo[currentTab.id] &&
      Array.isArray(savedTabInfo[currentTab.id])
    ) {
      result.push(...savedTabInfo[currentTab.id]);

      if (options && Array.isArray(options)) {
        for (const option of options) {
          if (!result.find(item => item.id === option.id)) {
            result.push(option);
          }
        }
      }
    } else {
      if (options && Array.isArray(options)) {
        result.push(...options);
      }
    }

    popupOptionsBuilder(result, document.getElementById('selected_bundles'));
    document.getElementById('popup-spinner').style.display = 'none';
    document.getElementById('content').style.visibility = 'visible';
  } catch (error) {
    console.error(`QueryParamsBuilder extension getOptions`, String(error));
  }
}

document
  .getElementById('applyParams')
  .addEventListener('click', applyParamsToUrl);

document.addEventListener('DOMContentLoaded', restoreOptions);
chrome.storage.sync.get(null).then(console.log);
