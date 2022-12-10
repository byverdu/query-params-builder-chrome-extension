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

  document.querySelectorAll('.delete-bundle').forEach(btn => {
    btn.addEventListener('click', event => {
      const id = event.currentTarget.dataset.bundleId;
      const idToRemove = optionsToBuild.findIndex(item => item.id === id);
      optionsToBuild.splice(idToRemove, 1);
      document.getElementById(id).remove();

      document.getElementById('saveOptions').removeAttribute('disabled');
    });
  });
}

function listItemBuilder({
  id,
  bundleName,
  urlParamKey,
  checked,
  urlParamValue,
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
      ${checked && 'checked'}
    >
    <label class="form-check-label" for="${id}">${bundleName}</label>
    <input
      type="text"
      class="form-control"
      data-id="${id}"
      placeholder="${urlParamKey} value"
      value="${(urlParamValue && urlParamValue) || ''}"
    />
  </li>
`;
}

/**
 * @param {import('../types/index.js').ExtensionOptions[]} optionsToBuild
 * @param {HTMLElement} target
 * @param {boolean} checked
 */
export function popupOptionsBuilder(optionsToBuild, target) {
  const groupedList = document.createElement('ul');
  let groupedListContent = '';

  groupedList.classList.add('list-group');

  for (const {
    id,
    bundleName,
    urlParamKey,
    urlParamValue,
    checked,
  } of optionsToBuild) {
    groupedListContent += listItemBuilder({
      id,
      bundleName,
      urlParamKey,
      checked,
      urlParamValue,
    });
  }

  groupedList.innerHTML = groupedListContent;

  target.insertAdjacentElement('beforebegin', groupedList);
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

    toastElement.addEventListener('hide.bs.toast', () => {
      document.getElementById('saveOptions').setAttribute('disabled', 'true');
    });
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
