function tableRowBuilder(id, bundleName, urlParamKey) {
  return `
  <tr id="${id}">
  <td>${bundleName}</td>
  <td>${urlParamKey}</td>
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
    const tr = tableRowBuilder(
      option.id,
      option.bundleName,
      option.urlParamKey
    );

    tbody.innerHTML += tr;
  }
}

export function listItemBuilder({
  id,
  bundleName,
  urlParamKey,
  checked,
  urlParamValue,
  canDeleteFromPopup,
}) {
  return `
  <li class="list-group-item">
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
    <input
      type="text"
      class="form-control"
      data-id="${id}"
      placeholder="${urlParamKey} value"
      value="${(urlParamValue && urlParamValue) || ''}"
    />
    ${
      (canDeleteFromPopup &&
        '<button class="btn btn-danger delete-new-item">-</button>') ||
      ''
    }
  </li>
`;
}

/**
 * @param {import('../types/index.js').ExtensionOptions[]} optionsToBuild
 * @param {HTMLElement} target
 * @param {boolean} checked
 */
export function popupOptionsBuilder(optionsToBuild) {
  const listGroup = document.querySelector('.list-group');
  let groupedListContent = '';

  for (const {
    id,
    bundleName,
    urlParamKey,
    urlParamValue,
    checked,
    canDeleteFromPopup,
  } of optionsToBuild) {
    groupedListContent += listItemBuilder({
      id,
      bundleName,
      urlParamKey,
      checked,
      urlParamValue,
      canDeleteFromPopup,
    });
  }

  if (listGroup) {
    listGroup.insertAdjacentHTML('beforeend', groupedListContent);
  } else {
    const target = document.getElementById('selected_bundles');
    const newListGroup = document.createElement('ul');
    newListGroup.classList.add('list-group');
    newListGroup.innerHTML = groupedListContent;

    target.insertAdjacentElement('afterbegin', newListGroup);
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
