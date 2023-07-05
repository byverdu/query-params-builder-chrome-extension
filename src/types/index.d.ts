interface ExtensionProps {
  bundleName: string;
  urlParamKey: string;
  id: string;
  url: string;
  urlParamValue: string;
  checked: boolean;
  canDeleteFromPopup: boolean;
}

type ExtensionItems = 'QueryParamsBuilderOptions' | 'QueryParamsBuilderTab';

type ExtensionActions =
  | 'GET_STORAGE'
  | 'SET_STORAGE'
  | 'GET_CURRENT_TAB'
  | 'UPDATE_URL_TAB'
  | 'REMOVE_ALL_STORAGE';

type GetStorageSyncCallback = (items: {
  [key in ExtensionItems]: ExtensionProps[];
}) => void;

type OnRemoveTabCallback = (
  tabId: number,
  removeInfo: chrome.tabs.TabRemoveInfo
) => void;

type OnMsgCallback = (
  msg: SendMsgParams,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
) => void;

type SendMsgPayload<T> = {
  key?: ExtensionItems;
  value?: T;
};

interface SendMsgParams {
  type: ExtensionActions;
  payload?: SendMsgPayload<any>;
}

type OptionsValue = ExtensionProps[];
type TabsValue = { [key: string]: ExtensionProps[] };
type SetStorage = OptionsValue | TabsValue;

interface API {
  setStorage: (key: ExtensionItems, value: SetStorage) => Promise<void>;
  setStorageSync: (key: ExtensionItems, value: SetStorage) => void;
  getStorage: (
    key: ExtensionItems
  ) => Promise<{ [key in ExtensionItems]: ExtensionProps[] }>;
  getStorageSync: (
    key: ExtensionItems,
    callback: GetStorageSyncCallback
  ) => void;
  sendMessage: (params: SendMsgParams) => Promise<any>;
  onRemovedTab: (callback: OnRemoveTabCallback) => void;
  onMessage: (callback: OnMsgCallback) => void;
  getCurrentTab: () => Promise<chrome.tabs.Tab[]>;
  updateUrlTab: (url: string) => Promise<chrome.tabs.Tab>;
  removeStorage: (key: ExtensionItems | ExtensionItems[]) => Promise<void>;
}

interface Toast {
  type: 'success' | 'danger';
  text: string;
}

type UpdateActions =
  | 'saveNewOption'
  | 'updateOption'
  | 'deleteOption'
  | 'deleteAll';

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

type UpdateOptionsPopup = (options: ExtensionProps[]) => void;

interface OptionsContext {
  toast: Toast;
  options: ExtensionProps[];
  setOptions: React.Dispatch<React.SetStateAction<ExtensionProps[]>>;
  setToast: React.Dispatch<React.SetStateAction<Toast>>;
  updateOptions: (options: ExtensionProps[], type: UpdateActions) => void;
}

interface PopupContext {
  currentTab: chrome.tabs.Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<chrome.tabs.Tab>>;
  options: ExtensionProps[];
  setOptions: React.Dispatch<React.SetStateAction<ExtensionProps[]>>;
}
