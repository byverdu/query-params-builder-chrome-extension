import {
  extensionApi,
  GET_CURRENT_TAB,
  SET_STORAGE,
  GET_STORAGE,
  UPDATE_URL_TAB,
} from '../../utils/api.js';
import {
  popupOptionsBuilder,
  randomId,
  getCheckboxesValues,
} from '../../utils/DOMHelpers.js';

const { sendMessage } = extensionApi;

sendMessage({ type: GET_CURRENT_TAB })
  .then(currentTab => {
    window.currentTab = currentTab;
  })
  .catch(console.error);

async function restoreOptions() {
  try {
    const currentTab = await sendMessage({ type: GET_CURRENT_TAB });
    const savedTabInfo = await sendMessage({
      type: GET_STORAGE,
      payload: 'QueryParamsBuilderTab',
    });
    const options = await sendMessage({
      type: GET_STORAGE,
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

    if (result.length > 0) {
      popupOptionsBuilder(result);
    }

    if (result.every(item => item.checked)) {
      document.querySelector('.check-all').checked = true;
    }

    document.querySelector('.wrapper').style.width = '800px';
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

    if (url) {
      const urlParams = new URLSearchParams(url.search || '');
      const tabInfoToSave = getCheckboxesValues();

      for (const { urlParamKey, checked, urlParamValue } of tabInfoToSave) {
        // delete all to update only with checked ones
        urlParams.delete(urlParamKey);

        if (checked) {
          urlParams.append(urlParamKey, urlParamValue);
        }
      }

      const initialUrl = `${url.origin}${url.pathname}`;
      const updatedUrl =
        urlParams.toString().length > 0
          ? `${initialUrl}?${urlParams.toString()}`
          : initialUrl;

      const updatedTab = await sendMessage({
        type: UPDATE_URL_TAB,
        payload: updatedUrl,
      });

      const savedTabs = await sendMessage({
        type: GET_STORAGE,
        payload: 'QueryParamsBuilderTab',
      });

      await sendMessage({
        type: SET_STORAGE,
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
        const value = curr.value;
        curr.value = '';
        return {
          ...prev,
          [curr.id]: value,
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
      type: SET_STORAGE,
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
    event.target.parentNode.parentNode.remove();
    const idToRemove = event.target.closest('.td-checkbox')?.id;
    const currentTab = window.currentTab ?? {};
    const tabInfoToSave = getCheckboxesValues().filter(
      item => item.id !== idToRemove
    );
    const withExtraThead = tabInfoToSave.some(
      option => option.canDeleteFromPopup
    );

    if (!withExtraThead) {
      document.querySelector('thead tr th:last-of-type').remove();
      document.querySelectorAll('tbody tr').forEach(elem => {
        const hasDeleteBtn = elem.querySelectorAll('td').length === 3;
        if (hasDeleteBtn) {
          elem.querySelector('td:last-of-type').remove();
        }
      });
    }

    await sendMessage({
      type: SET_STORAGE,
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

function checkAllHandler(event) {
  document
    .querySelectorAll('tbody input[type="checkbox"]')
    .forEach(elem => (elem.checked = event.target.checked));
}

if (document.readyState === 'interactive') {
  document.addEventListener('DOMContentLoaded', restoreOptions);

  document
    .getElementById('applyParams')
    .addEventListener('click', applyParamsToUrl);

  document
    .querySelector('.check-all')
    .addEventListener('change', checkAllHandler);

  document
    .querySelector('form')
    .addEventListener('submit', appendNewItemToList);
}
