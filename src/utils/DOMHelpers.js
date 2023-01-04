function optionsTableRowBuilder(id, bundleName, urlParamKey) {
  return `
  <tr id="${id}">
  <td class="contentEditable" data-initial-value="${bundleName}" data-value-type="bundleName" contentEditable="true">${bundleName}</td>
  <td class="contentEditable" data-initial-value="${urlParamKey}" data-value-type="urlParamKey" contentEditable="true">${urlParamKey}</td>
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
 * @param {HTMLTableSectionElement} tbody
 */
export function optionsToTableDefinitionBuilder(optionsToBuild, tbody) {
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
}) {
  return `
  <tr>
    <td>
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
      '<td></td>'
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
    });
  }

  if (tbody) {
    tbody.insertAdjacentHTML('beforeend', tableRows);
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

export function getCheckboxesValues() {
  const tabInfoToSave = [];

  /**
   * @type HTMLInputElement[]
   */
  const checkboxes = Array.from(
    document.querySelectorAll('input[type="checkbox"]')
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
