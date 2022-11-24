const GET_OPTIONS = 'GET_OPTIONS';
const SET_OPTIONS = 'SET_OPTIONS';

export const actions = {
  GET_OPTIONS,
  SET_OPTIONS,
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
};
