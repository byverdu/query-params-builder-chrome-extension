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

let toast, headerToast, bodyToast;

(function toastElemInit() {
  const toastElement = document.getElementById('optionsPageToast');
  if (toastElement) {
    toast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 3000,
    });

    headerToast = toastElement.querySelector('.toast-header .badge');
    bodyToast = toastElement.querySelector('.toast-body');

    toastElement.addEventListener('hide.bs.toast', () => {
      document.getElementById('saveOptions').setAttribute('disabled', 'true');
    });
  }
})();

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
      toast,
      toastType: 'success',
      bodyToast,
      headerToast,
      bodyToastText: 'Options Saved Successfully',
    });
  } catch (error) {
    logger('error', 'setOptions', String(error));

    setToastContent({
      toast,
      toastType: 'danger',
      bodyToast,
      headerToast,
      bodyToastText: error.message,
    });
  }
}

async function restoreOptions() {
  try {
    const resp = await sendMessage({ type: actions.GET_OPTIONS });

    if (resp && Array.isArray(resp)) {
      const tbody = document.querySelector('.selected_bundles tbody');

      globalOptions.push(...resp);

      optionsToTableDefinitionBuilder(globalOptions, tbody);

      setToastContent({
        toast,
        toastType: 'success',
        bodyToast,
        headerToast,
        bodyToastText: 'Options Restored Successfully',
      });
    }
  } catch (error) {
    logger('error', 'getOptions', String(error));

    setToastContent({
      toast,
      toastType: 'danger',
      bodyToast,
      headerToast,
      bodyToastText: error.message,
    });
  }
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);
document
  .getElementById('addBundle')
  .addEventListener('click', addBundleToOptions);

// chrome.storage.sync.remove('QueryParamsBuilder');

chrome.storage.sync.get(null).then(console.log);
