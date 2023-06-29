/**
 * @typedef {Object} ExtendedProps
 * @property {boolean} withExtraThead
 * @typedef {import('../../types/index.js').ExtensionOptions & ExtendedProps} Props
 */

/**
 * @param {Props} param
 * @returns string
 */
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
