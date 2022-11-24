function tableRowBuilder(id, bundleName, urlParamValue) {
  return `
  <tr id="${id}">
  <td>${bundleName}</td>
  <td>${urlParamValue}</td>
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
      option.urlParamValue
    );

    tbody.innerHTML += tr;
  }

  document.querySelectorAll('.delete-bundle').forEach(btn => {
    btn.addEventListener('click', event => {
      const id = event.currentTarget.dataset.bundleId;
      const idToRemove = optionsToBuild.findIndex(item => item.id !== id);
      optionsToBuild.splice(idToRemove, 1);
      document.getElementById(id).remove();

      document.getElementById('saveOptions').removeAttribute('disabled');
    });
  });
}

/**
 * @param {import('../types/index.js').Toast} params
 */
export function setToastContent({
  toastElement,
  toast,
  headerToast,
  bodyToast,
  toastType,
  bodyToastText,
}) {
  const savedOptionsToastText = {
    success: {
      header: 'Success!',
      body: 'Options Saved Successfully',
    },
    danger: {
      header: 'Error!',
    },
  };
  if (toastElement && toast && headerToast && bodyToast) {
    headerToast.textContent = savedOptionsToastText[toastType].header;
    bodyToast.textContent = bodyToastText
      ? bodyToastText
      : savedOptionsToastText[toastType].body;

    headerToast.className += ` text-bg-${toastType}`;

    toast.show();

    toastElement.addEventListener('hide.bs.toast', () => {
      document.getElementById('saveOptions').setAttribute('disabled', 'true');
    });
  }
}

export function randomId() {
  return crypto.randomUUID();
}
