import {
  optionsToTableDefinitionBuilder,
  randomId,
  setToastContent,
} from '../../utils/DOMHelpers.js';
import { extensionApi, actions } from '../../utils/api.js';

/**
 * @type {import('../../types/index.js').ExtensionOptions[]}
 */
const globalOptions = [];
const { sendMessage } = extensionApi;

async function restoreOptions() {
  try {
    const options = await sendMessage({
      type: actions.GET_STORAGE,
      payload: 'QueryParamsBuilderOptions',
    });

    if (options && Array.isArray(options)) {
      const tbody = document.querySelector('.selected_bundles tbody');

      globalOptions.push(...options);

      optionsToTableDefinitionBuilder(globalOptions, tbody);

      document
        .querySelectorAll('.delete-bundle')
        .forEach(btn => btn.addEventListener('click', deleteSavedParam));
      document
        .querySelectorAll('.contentEditable')
        .forEach(item => item.addEventListener('blur', editSavedParam));

      setToastContent({
        toastType: 'success',
        bodyToastText: 'Options Restored Successfully',
      });
    }
  } catch (error) {
    console.error(`QueryParamsBuilder extension getOptions`, String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

async function addBundleToOptions(e) {
  e.preventDefault();

  const errorMsg = 'This value can not be empty';
  const bundleName = document.getElementById('bundleName');
  const urlParamKey = document.getElementById('urlParamKey');
  const tbody = document.querySelector('.selected_bundles tbody');
  const isValidName = bundleName.validity.valid;
  const isValidParam = urlParamKey.validity.valid;

  if (!isValidName) {
    bundleName.classList.add('is-invalid');
    bundleName.placeholder = errorMsg;
  }

  if (!isValidParam) {
    urlParamKey.classList.add('is-invalid');
    urlParamKey.placeholder = errorMsg;
  }

  if (isValidName && isValidParam) {
    urlParamKey.classList.remove('is-invalid');
    bundleName.classList.remove('is-invalid');
    tbody.textContent = '';

    globalOptions.push({
      bundleName: bundleName.value,
      urlParamKey: urlParamKey.value,
      id: randomId(),
      checked: false,
      canDeleteFromPopup: false,
    });

    optionsToTableDefinitionBuilder(globalOptions, tbody);
    bundleName.value = '';
    urlParamKey.value = '';

    document
      .querySelectorAll('.contentEditable')
      .forEach(item => item.addEventListener('blur', editSavedParam));

    try {
      await sendMessage({
        type: actions.SET_STORAGE,
        payload: { key: 'QueryParamsBuilderOptions', value: globalOptions },
      });

      setToastContent({
        toastType: 'success',
        bodyToastText: 'Options Saved Successfully',
      });
    } catch (error) {
      console.error(`QueryParamsBuilder extension addBundle`, String(error));

      setToastContent({ toastType: 'danger', bodyToastText: error.message });
    }
  }
}

async function deleteSavedParam(event) {
  const id = event.currentTarget.dataset.bundleId;
  const idToRemove = globalOptions.findIndex(item => item.id === id);
  globalOptions.splice(idToRemove, 1);
  document.getElementById(id).remove();

  try {
    await sendMessage({
      type: actions.SET_STORAGE,
      payload: { key: 'QueryParamsBuilderOptions', value: globalOptions },
    });

    setToastContent({
      toastType: 'success',
      bodyToastText: 'Options Saved Successfully',
    });
  } catch (error) {
    console.error(`QueryParamsBuilder extension delete`, String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

async function editSavedParam(event) {
  /**
   * @type HTMLInputElement
   */
  const inputElem = event.target;
  const lastValue = inputElem.innerText;
  const valueType = inputElem.dataset.valueType;
  const initialValue = inputElem.dataset.initialValue;

  if (lastValue !== initialValue) {
    const id = globalOptions.findIndex(
      item => item[valueType] === initialValue
    );
    const item =
      globalOptions.find(item => item[valueType] === initialValue) || {};
    item[valueType] = lastValue;

    globalOptions.splice(id, 1, item);

    try {
      await sendMessage({
        type: actions.SET_STORAGE,
        payload: { key: 'QueryParamsBuilderOptions', value: globalOptions },
      });

      setToastContent({
        toastType: 'success',
        bodyToastText: 'Options Saved Successfully',
      });
    } catch (error) {
      console.error(`QueryParamsBuilder extension edit`, String(error));

      setToastContent({ toastType: 'danger', bodyToastText: error.message });
    }
  }
}

async function removeAll() {
  try {
    await sendMessage({
      type: actions.REMOVE_ALL_STORAGE,
      payload: ['QueryParamsBuilderOptions', 'QueryParamsBuilderTab'],
    });

    document.querySelector('.selected_bundles tbody').textContent = '';

    setToastContent({
      toastType: 'success',
      bodyToastText: 'All Options Removed Successfully',
    });
  } catch (error) {
    console.error(`QueryParamsBuilder extension removeAll`, String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document
  .getElementById('addBundle')
  .addEventListener('click', addBundleToOptions);
document.getElementById('removeAll').addEventListener('click', removeAll);
chrome.storage.sync.get(null).then(console.log).catch(console.error);
