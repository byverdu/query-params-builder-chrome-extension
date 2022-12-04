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

function addBundleToOptions(e) {
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
    });

    optionsToTableDefinitionBuilder(globalOptions, tbody);
    bundleName.value = '';
    urlParamKey.value = '';

    document.getElementById('saveOptions').removeAttribute('disabled');
  }
}

async function saveOptions() {
  try {
    await sendMessage({
      type: actions.SET_OPTIONS,
      payload: { key: 'QueryParamsBuilderOptions', value: globalOptions },
    });

    setToastContent({
      toastType: 'success',
      bodyToastText: 'Options Saved Successfully',
    });
  } catch (error) {
    console.error(`QueryParamsBuilder extension setOptions`, String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

async function restoreOptions() {
  try {
    const options = await sendMessage({
      type: actions.GET_OPTIONS,
      payload: 'QueryParamsBuilderOptions',
    });

    if (options && Array.isArray(options)) {
      const tbody = document.querySelector('.selected_bundles tbody');

      globalOptions.push(...options);

      optionsToTableDefinitionBuilder(globalOptions, tbody);

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

async function removeAll() {
  try {
    await sendMessage({
      type: actions.REMOVE_ALL,
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
document.getElementById('saveOptions').addEventListener('click', saveOptions);
document
  .getElementById('addBundle')
  .addEventListener('click', addBundleToOptions);
document.getElementById('removeAll').addEventListener('click', removeAll);

// chrome.storage.sync.remove('QueryParamsBuilder');

chrome.storage.sync.get(null).then(console.log);
