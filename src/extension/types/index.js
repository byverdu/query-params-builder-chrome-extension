/**
 * @typedef {"QueryParamsBuilderOptions" | "QueryParamsBuilderTab"} ExtensionItems
 */

/**
 * @typedef {"GET_STORAGE" | "SET_STORAGE" | "GET_CURRENT_TAB" | "UPDATE_URL_TAB" | "REMOVE_ALL_STORAGE"} ExtensionActions
 */

/**
 * @typedef {Object} SendMsgParams
 * @property {ExtensionActions} type
 * @property {SendMsgPayload} payload
 */

/**
 * @typedef {Object} SendMsgPayload
 * @property {ExtensionItems} [key]
 * @property {any} [value]
 */

/**
 * @callback OnMsgCallback
 * @param {SendMsgParams} msg
 * @param {chrome.runtime.MessageSender} sender
 * @param {(response: any) => void} sendResponse
 */

/**
 * @callback OnRemoveTabCallback
 * @param {number} tabId
 * @param {chrome.tabs.TabRemoveInfo} removeInfo
 */

/**
 * @typedef {Object} ExtensionOptions
 * @property {string} bundleName
 * @property {string} urlParamKey
 * @property {string} id
 * @property {string} url
 * @property {string} urlParamValue
 * @property {boolean} checked
 * @property {boolean} canDeleteFromPopup
 */

/**
 * @typedef {Object} API
 * @property {(key: ExtensionItems, value: ExtensionOptions[]) => Promise<void>} setStorage
 * @property {(key: ExtensionItems, value: ExtensionOptions[]) => void} setStorageSync
 * @property {(key: ExtensionItems) => Promise<{[key in ExtensionItems]: ExtensionOptions[]}>} getStorage
 * @property {(key: ExtensionItems, callback: () => void) => void} getStorageSync
 * @property {(params: SendMsgParams) => Promise<any>} sendMessage
 * @property {(callback: OnRemoveTabCallback) => void} onRemovedTab
 * @property {(callback: OnMsgCallback) => void} onMessage
 * @property {() => Promise<chrome.tabs.Tab[]>} getCurrentTab
 * @property {(url: string) => Promise<chrome.tabs.Tab>} updateUrlTab
 * @property {(key: ExtensionItems | ExtensionItems[]) => Promise<void>} removeStorage
 *
 */

/**
 * @typedef {Object} Toast
 * @property {"success" | "danger"} type
 * @property {string} text
 */

/**
 * @typedef {"saveNewOption" | "updateOption" | "deleteOption" | "deleteAll"} UpdateActions
 */

/**
 * @typedef {(options: ExtensionOptions[], type: UpdateActions) => void} UpdateOptionsParams
 */

/**
 * @typedef {Object} OptionsContext
 * @property {Toast} toast
 * @property {ExtensionOptions[]} options
 * @property { React.Dispatch<React.SetStateAction<ExtensionOptions[]>>} setOptions
 * @property { React.Dispatch<React.SetStateAction<Toast>>} setToast
 * @property {UpdateOptionsParams} updateOptions
 */

export {};
