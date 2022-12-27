import { extensionApi, actions } from '../../utils/api.js';
import {
  popupOptionsBuilder,
  randomId,
  castToBoolean,
  getCheckboxesValues,
} from '../../utils/DOMHelpers.js';

const { sendMessage } = extensionApi;

sendMessage({ type: actions.GET_CURRENT_TAB })
  .then(currentTab => {
    window.currentTab = currentTab;
  })
  .catch(console.error);

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
    const validOptions = options && Array.isArray(options) ? options : [];

    if (
      savedTabInfo &&
      savedTabInfo[currentTab.id] &&
      Array.isArray(savedTabInfo[currentTab.id])
    ) {
      result.push(...savedTabInfo[currentTab.id]);

      for (const option of validOptions) {
        if (!result.find(item => item.id === option.id)) {
          result.push(option);
        }
      }
    } else {
      result.push(...validOptions);
    }

    popupOptionsBuilder(result);
    document.getElementById('popup-spinner').style.display = 'none';
    document.getElementById('content').style.visibility = 'visible';

    document
      .querySelectorAll('.delete-new-item')
      .forEach(item => item.addEventListener('click', deleteNewItem));
  } catch (error) {
    console.error(`QueryParamsBuilder extension getOptions`, String(error));
  }
}

async function applyParamsToUrl() {
  try {
    const currentTab = window.currentTab ?? {};
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

        const canDeleteFromPopup = castToBoolean(
          input.dataset.canDeleteFromPopup
        );
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
          canDeleteFromPopup,
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

      const savedTabs = await sendMessage({
        type: actions.GET_STORAGE,
        payload: 'QueryParamsBuilderTab',
      });

      await sendMessage({
        type: actions.SET_STORAGE,
        payload: {
          key: 'QueryParamsBuilderTab',
          value: {
            ...savedTabs,
            [updatedTab.id]: tabInfoToSave,
          },
        },
      });
    }
  } catch (error) {
    console.error(`QueryParamsBuilder extension getTab`, String(error));
  }
}

async function appendNewItemToList(event) {
  event.preventDefault();

  const { elements } = event.target;
  const inputsValues = Array.from(elements)
    .filter(elem => elem.nodeName === 'INPUT')
    .reduce(
      (prev, curr) => {
        return {
          ...prev,
          [curr.id]: curr.value,
        };
      },
      { checked: false, id: randomId(), canDeleteFromPopup: true }
    );
  popupOptionsBuilder([inputsValues]);

  document
    .querySelectorAll('.delete-new-item')
    .forEach(item => item.addEventListener('click', deleteNewItem));

  const currentTab = window.currentTab ?? {};
  const tabInfoToSave = getCheckboxesValues();

  try {
    await sendMessage({
      type: actions.SET_STORAGE,
      payload: {
        key: 'QueryParamsBuilderTab',
        value: {
          [currentTab.id]: tabInfoToSave,
        },
      },
    });
  } catch (error) {
    console.error(
      `QueryParamsBuilder extension appendNewItemToList`,
      String(error)
    );
  }
}

async function deleteNewItem(event) {
  try {
    event.target.parentNode.remove();
    const currentTab = window.currentTab ?? {};
    const tabInfoToSave = getCheckboxesValues();

    await sendMessage({
      type: actions.SET_STORAGE,
      payload: {
        key: 'QueryParamsBuilderTab',
        value: {
          [currentTab.id]: tabInfoToSave,
        },
      },
    });
  } catch (error) {
    console.error(`QueryParamsBuilder extension deleteNewItem`, String(error));
  }
}

if (document.readyState === 'interactive') {
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document
    .getElementById('applyParams')
    .addEventListener('click', applyParamsToUrl);

  document
    .querySelector('form')
    .addEventListener('submit', appendNewItemToList);
  chrome.storage.sync.get(null).then(console.log).catch(console.error);
}
