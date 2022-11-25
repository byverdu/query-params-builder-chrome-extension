const GET_OPTIONS = 'GET_OPTIONS';
const SET_OPTIONS = 'SET_OPTIONS';

export const actions = {
  GET_OPTIONS,
  SET_OPTIONS,
};

/**
 *
 * @param {"log" | "error" | "warn"} logType
 * @param {"getOptions" | "setOptions" | "updateTab" | "getTab"} msgType
 * @param {string} msg
 */
export function logger(logType, msgType, msg) {
  console[logType](`QueryParamsBuilder extension ${msgType} ${logType}`, msg);
}

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
