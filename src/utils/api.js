const GET_STORAGE = 'GET_STORAGE';
const SET_STORAGE = 'SET_STORAGE';
const GET_CURRENT_TAB = 'GET_CURRENT_TAB';
const UPDATE_URL_TAB = 'UPDATE_URL_TAB';
const REMOVE_ALL_STORAGE = 'REMOVE_ALL_STORAGE';

export const actions = {
  GET_STORAGE,
  SET_STORAGE,
  GET_CURRENT_TAB,
  UPDATE_URL_TAB,
  REMOVE_ALL_STORAGE,
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
