function optionsTableRowBuilder(id, bundleName, urlParamKey) {
  return `
  <tr id="${id}">
  <td class="contentEditable" data-initial-value="${bundleName}" data-value-type="bundleName" contentEditable="true">
    <span>${bundleName}</span>
  </td>
  <td class="contentEditable" data-initial-value="${urlParamKey}" data-value-type="urlParamKey" contentEditable="true">
    <span>${urlParamKey}</span>
  </td>
  <td>
    <button data-bundle-id="${id}" class="btn btn-outline-danger delete-bundle">
      Delete
    </button>
  </td>
</tr>
  `;
}

/**
 * @param {import('../types/index.js').ExtensionOptions[]} optionsToBuild
 */
export function optionsToTableDefinitionBuilder(optionsToBuild) {
  const tbody = document.querySelector('.selected_bundles tbody');

  for (const option of optionsToBuild) {
    const tr = optionsTableRowBuilder(
      option.id,
      option.bundleName,
      option.urlParamKey
    );

    tbody.innerHTML += tr;
  }
}

export function popupTableRowBuilder({
  id,
  bundleName,
  urlParamKey,
  checked,
  urlParamValue,
  canDeleteFromPopup,
  withExtraThead,
}) {
  return `
  <tr>
    <td class="td-checkbox">
      <input
        class="form-check-input me-1"
        type="checkbox"
        value="${urlParamKey}"
        data-url-param-key="${urlParamKey}"
        data-bundle-name="${bundleName}"
        id="${id}"
        ${(checked && 'checked') || ''}
        data-can-delete-from-popup="${canDeleteFromPopup}"
      >
      <label class="form-check-label" for="${id}">${bundleName}</label>
    </td>
    <td>
      <input
        type="text"
        class="form-control"
        data-id="${id}"
        placeholder="${urlParamKey} value"
        value="${(urlParamValue && urlParamValue) || ''}"
      />
    </td>
    ${
      (canDeleteFromPopup &&
        '<td><button class="btn btn-danger delete-new-item">-</button></td>') ||
      (withExtraThead && '<td></td>') ||
      ''
    }
  </tr>
`;
}

/**
 * @param {import('../types/index.js').ExtensionOptions[]} optionsToBuild
 */
export function popupOptionsBuilder(optionsToBuild) {
  const table = document.querySelector('.table');
  table.style.visibility = 'visible';
  const tbody = table.querySelector('tbody');
  let tableRows = '';
  const withExtraThead = optionsToBuild.some(
    option => option.canDeleteFromPopup
  );

  if (withExtraThead && !document.getElementById('withExtraThead')) {
    table
      .querySelector('thead tr')
      .insertAdjacentHTML(
        'beforeend',
        '<th id="withExtraThead" scope="col">Actions</th>'
      );
  }

  for (const {
    id,
    bundleName,
    urlParamKey,
    urlParamValue,
    checked,
    canDeleteFromPopup,
  } of optionsToBuild) {
    tableRows += popupTableRowBuilder({
      id,
      bundleName,
      urlParamKey,
      checked,
      urlParamValue,
      canDeleteFromPopup,
      withExtraThead,
    });
  }

  if (tbody) {
    tbody.insertAdjacentHTML('beforeend', tableRows);
  }

  if (optionsToBuild.length === 1 && withExtraThead) {
    tbody.querySelectorAll('tr').forEach(elem => {
      const withoutDeleteBtn = elem.querySelectorAll('td').length === 2;
      if (withoutDeleteBtn) {
        elem.insertAdjacentHTML('beforeend', '<td></td>');
      }
    });
  }
}

/**
 * @param {import('../types/index.js').Toast} params
 */
export function setToastContent({ toastType, bodyToastText }) {
  let toast, headerToast, bodyToast;

  const optionsPageToastText = {
    success: 'Success!',
    danger: 'Error!',
  };

  const toastElement = document.getElementById('optionsPageToast');
  if (toastElement) {
    toast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 3000,
    });

    headerToast = toastElement.querySelector('.toast-header .badge');
    bodyToast = toastElement.querySelector('.toast-body');
  }

  if (toast && headerToast && bodyToast) {
    headerToast.textContent = optionsPageToastText[toastType];
    bodyToast.textContent = bodyToastText;

    headerToast.className += ` text-bg-${toastType}`;

    toast.show();
  }
}

export function randomId() {
  return crypto.randomUUID();
}

export function castToBoolean(value) {
  try {
    const parsed = JSON.parse(value);
    return Boolean(parsed);
  } catch {
    return false;
  }
}

/**
 *
 * @returns @param {import('../types/index.js').ExtensionOptions[]} optionsToBuild[]
 */
export function getCheckboxesValues() {
  const tabInfoToSave = [];

  /**
   * @type HTMLInputElement[]
   */
  const checkboxes = Array.from(
    document.querySelectorAll('tbody input[type="checkbox"]')
  );

  for (const input of checkboxes) {
    const canDeleteFromPopup = castToBoolean(input.dataset.canDeleteFromPopup);
    const bundleId = input.id;
    const urlParamKey = input.value;
    const urlParamValue = document.querySelector(
      `[data-id="${bundleId}"]`
    ).value;
    const bundleName = input.dataset.bundleName;

    tabInfoToSave.push({
      id: bundleId,
      canDeleteFromPopup,
      checked: input.checked,
      urlParamKey,
      bundleName,
      urlParamValue,
    });
  }

  return tabInfoToSave;
}
