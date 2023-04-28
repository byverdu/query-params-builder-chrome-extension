import { optionsTableRowBuilder } from './optionsTableRowBuilder';

/**
 * @param {import('../../types/index.js').ExtensionOptions[]} optionsToBuild
 */
export function savedOptionsToTableRows(optionsToBuild) {
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
