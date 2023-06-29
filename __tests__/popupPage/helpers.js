/**
 *
 * @param {import('../../src/types/index.js').ExtensionOptions} [overrides]
 * @returns
 */
export const propsBuilder = overrides => {
  return {
    id: '123',
    bundleName: 'api key',
    urlParamKey: 'apiKey',
    checked: true,
    urlParamValue: 'isASecret',
    canDeleteFromPopup: false,
    ...overrides,
  };
};
