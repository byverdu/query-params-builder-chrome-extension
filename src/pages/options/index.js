import {
  optionsToTableDefinitionBuilder,
  randomId,
  setToastContent,
} from '../../utils/DOMHelpers.js';
import {
  extensionApi,
  SET_STORAGE,
  GET_STORAGE,
  REMOVE_ALL_STORAGE,
} from '../../utils/api.js';

/**
 * @type {import('../../types/index.js').ExtensionOptions[]}
 */
const globalOptions = [];
const { sendMessage } = extensionApi;

async function restoreOptions() {
  try {
    const options = await sendMessage({
      type: GET_STORAGE,
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
    document
      .querySelector('.delete-bundle')
      .addEventListener('click', deleteSavedParam);

    try {
      await sendMessage({
        type: SET_STORAGE,
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

  document.getElementById(id).remove();
  globalOptions.splice(idToRemove, 1);

  try {
    const savedTabInfo = await sendMessage({
      type: GET_STORAGE,
      payload: 'QueryParamsBuilderTab',
    });
    const newTabValues = Object.keys(savedTabInfo).reduce((prev, curr) => {
      const filteredValues = savedTabInfo[curr].filter(item => item.id !== id);

      return {
        ...prev,
        [curr]: filteredValues,
      };
    }, {});

    await sendMessage({
      type: SET_STORAGE,
      payload: { key: 'QueryParamsBuilderOptions', value: globalOptions },
    });
    await sendMessage({
      type: SET_STORAGE,
      payload: { key: 'QueryParamsBuilderTab', value: newTabValues },
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
  const newValue = inputElem.innerText;
  const valueType = inputElem.dataset.valueType;
  const initialValue = inputElem.dataset.initialValue;

  if (newValue !== initialValue) {
    inputElem.dataset.initialValue = newValue;
    const id = globalOptions.findIndex(
      item => item[valueType] === initialValue
    );
    const item =
      globalOptions.find(item => item[valueType] === initialValue) || {};
    item[valueType] = newValue;

    globalOptions.splice(id, 1, item);

    try {
      const savedTabInfo = await sendMessage({
        type: GET_STORAGE,
        payload: 'QueryParamsBuilderTab',
      });

      if (savedTabInfo) {
        const newTabValues = Object.keys(savedTabInfo).reduce((prev, curr) => {
          const newValues = savedTabInfo[curr].reduce((prev, curr) => {
            if (curr[valueType] === initialValue) {
              curr[valueType] = newValue;
            }
            return [...prev, curr];
          }, []);

          return {
            ...prev,
            [curr]: newValues,
          };
        }, {});

        await sendMessage({
          type: SET_STORAGE,
          payload: { key: 'QueryParamsBuilderTab', value: newTabValues },
        });
      }

      await sendMessage({
        type: SET_STORAGE,
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
      type: REMOVE_ALL_STORAGE,
      payload: ['QueryParamsBuilderOptions', 'QueryParamsBuilderTab'],
    });

    document.querySelector('.selected_bundles tbody').textContent = '';
    globalOptions.length = 0;

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
