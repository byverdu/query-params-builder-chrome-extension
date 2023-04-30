import { optionsTableRowBuilder } from './optionsTableRowBuilder';

/**
 * @param {import('../../types/index.js').ExtensionOptions[]} optionsToBuild
 */
export function savedOptionsToTableRows(optionsToBuild) {
  const tbody = document.querySelector('.selected_bundles tbody');

  if (tbody) {
    for (const option of optionsToBuild) {
      const tr = optionsTableRowBuilder(
        option.id,
        option.bundleName,
        option.urlParamKey
      );

      tbody.innerHTML += tr;
    }
  } else {
    throw new Error(
      'No .selected_bundles tbody selector present on the document'
    );
  }
}
