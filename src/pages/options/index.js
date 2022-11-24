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

function saveOptions() {
  const toastElement = document.getElementById('savedOptionsToast');
  let toast, headerToast, bodyToast;

  if (toastElement) {
    toast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 3000,
    });

    headerToast = toastElement.querySelector('.toast-header .badge');
    bodyToast = toastElement.querySelector('.toast-body');
  }

  sendMessage({ type: actions.SET_OPTIONS, payload: globalOptions })
    .then(() => {
      setToastContent({
        toast,
        toastElement,
        toastType: 'success',
        bodyToast,
        headerToast,
      });
    })
    .catch(e => {
      console.error(e);

      setToastContent({
        toast,
        toastElement,
        toastType: 'danger',
        bodyToast,
        headerToast,
        bodyToastText: e.message,
      });
    });
}

function restoreOptions() {
  sendMessage({ type: actions.GET_OPTIONS })
    .then(resp => {
      if (resp && Array.isArray(resp)) {
        const tbody = document.querySelector('.selected_bundles tbody');

        globalOptions.push(...resp);

        optionsToTableDefinitionBuilder(globalOptions, tbody);
      }
    })
    .catch(e => {
      console.error(e);
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveOptions').addEventListener('click', saveOptions);
document
  .getElementById('addBundle')
  .addEventListener('click', addBundleToOptions);
