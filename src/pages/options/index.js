import {
  optionsToTableDefinitionBuilder,
  randomId,
  setToastContent,
} from '../../utils/DOMHelpers.js';
import { extensionApi, actions, logger } from '../../utils/api.js';

/**
 * @type {import('../../types/index.js').ExtensionOptions[]}
 */
const globalOptions = [];
const { sendMessage } = extensionApi;

function addBundleToOptions(e) {
  e.preventDefault();

  const errorMsg = 'This value can not be empty';
  const bundleName = document.getElementById('bundleName');
  const urlParamValue = document.getElementById('urlParamValue');
  const tbody = document.querySelector('.selected_bundles tbody');
  const isValidName = bundleName.validity.valid;
  const isValidParam = urlParamValue.validity.valid;

  if (!isValidName) {
    bundleName.classList.add('is-invalid');
    bundleName.placeholder = errorMsg;
  }

  if (!isValidParam) {
    urlParamValue.classList.add('is-invalid');
    urlParamValue.placeholder = errorMsg;
  }

  if (isValidName && isValidParam) {
    urlParamValue.classList.remove('is-invalid');
    bundleName.classList.remove('is-invalid');
    tbody.textContent = '';

    globalOptions.push({
      bundleName: bundleName.value,
      urlParamValue: urlParamValue.value,
      id: randomId(),
    });

    optionsToTableDefinitionBuilder(globalOptions, tbody);
    bundleName.value = '';
    urlParamValue.value = '';

    document.getElementById('saveOptions').removeAttribute('disabled');
  }
}

async function saveOptions() {
  try {
    await sendMessage({ type: actions.SET_OPTIONS, payload: globalOptions });

    setToastContent({
      toastType: 'success',
      bodyToastText: 'Options Saved Successfully',
    });
  } catch (error) {
    logger('error', 'setOptions', String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

async function restoreOptions() {
  try {
    const options = await sendMessage({ type: actions.GET_OPTIONS });

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
    logger('error', 'getOptions', String(error));

    setToastContent({ toastType: 'danger', bodyToastText: error.message });
  }
}

async function removeAll() {
  try {
    await sendMessage({
      type: actions.REMOVE_ALL,
      payload: 'QueryParamsBuilderOptions',
    });

    document.querySelector('.selected_bundles tbody').textContent = '';

    setToastContent({
      toastType: 'success',
      bodyToastText: 'All Options Removed Successfully',
    });
  } catch (error) {
    logger('error', 'getOptions', String(error));

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
