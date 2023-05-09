/**
 *
 * @param {string} id
 * @param {string} bundleName
 * @param {string} urlParamKey
 * @returns string
 */
export function optionsTableRowBuilder(id, bundleName, urlParamKey) {
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
