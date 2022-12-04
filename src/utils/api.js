const GET_OPTIONS = 'GET_OPTIONS';
const SET_OPTIONS = 'SET_OPTIONS';
const GET_CURRENT_TAB = 'GET_CURRENT_TAB';
const UPDATE_URL_TAB = 'UPDATE_URL_TAB';
const REMOVE_ALL = 'REMOVE_ALL';

export const actions = {
  GET_OPTIONS,
  SET_OPTIONS,
  GET_CURRENT_TAB,
  UPDATE_URL_TAB,
  REMOVE_ALL,
};

export const extensionApi = {
  setStorage: async (key, value) =>
    await chrome.storage.sync.set({
      [key]: value,
    }),
  getStorage: async key => await chrome.storage.sync.get(key),
  sendMessage: async ({ type, payload }) =>
    await chrome.runtime.sendMessage({
      type,
      payload,
    }),

  onMessage: callback => chrome.runtime.onMessage.addListener(callback),
  getCurrentTab: async () =>
    await chrome.tabs.query({ active: true, currentWindow: true }),
  updateUrlTab: async url => await chrome.tabs.update({ url }),
  removeStorage: async key => await chrome.storage.sync.remove(key),
};
