export const OPTIONS_ITEM = 'QueryParamsBuilderOptions';
export const TABS_ITEM = 'QueryParamsBuilderTab';
export const GET_STORAGE = 'GET_STORAGE';
export const SET_STORAGE = 'SET_STORAGE';
export const GET_CURRENT_TAB = 'GET_CURRENT_TAB';
export const UPDATE_URL_TAB = 'UPDATE_URL_TAB';
export const REMOVE_ALL_STORAGE = 'REMOVE_ALL_STORAGE';

/**
 * @type {import('../types/index.js').API}
 */
export const extensionApi = {
  setStorage: async (key, value) =>
    await chrome.storage.sync.set({
      [key]: value,
    }),
  setStorageSync: (key, value) =>
    chrome.storage.sync.set({
      [key]: value,
    }),
  getStorage: async key => await chrome.storage.sync.get(key),
  getStorageSync: (key, callback) => chrome.storage.sync.get(key, callback),
  sendMessage: async ({ type, payload }) =>
    await chrome.runtime.sendMessage({
      type,
      payload,
    }),
  onRemovedTab: callback => chrome.tabs.onRemoved.addListener(callback),
  onMessage: callback => chrome.runtime.onMessage.addListener(callback),
  getCurrentTab: async () =>
    await chrome.tabs.query({ active: true, currentWindow: true }),
  updateUrlTab: async url => await chrome.tabs.update({ url }),
  removeStorage: async key => await chrome.storage.sync.remove(key),
};
