import { popupTableRowBuilder } from './popupTableRowBuilder.js';

/**
 *
 * @param {HTMLTableElement} table
 */
function appendExtraTableHeader(table) {
  const tableHeader = table.querySelector('thead tr');

  if (!tableHeader) {
    throw new Error('No thead tr selector present on the document');
  }

  tableHeader.insertAdjacentHTML(
    'beforeend',
    '<th id="withExtraThead" scope="col">Actions</th>'
  );
}

/**
 * @param {import('../../types/index.js').ExtensionOptions[]} optionsToBuild
 */
export function popupTableBuilder(optionsToBuild) {
  /**
   * @type HTMLTableElement | null
   */
  const table = document.querySelector('.table');

  if (!table) {
    throw new Error('No .table selector present on the document');
  }

  const tbody = table.querySelector('tbody');
  let tableRows = '';
  const withExtraThead = optionsToBuild.some(
    option => option.canDeleteFromPopup
  );

  if (withExtraThead && !document.getElementById('withExtraThead')) {
    appendExtraTableHeader(table);
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
