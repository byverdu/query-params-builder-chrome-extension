interface BaseExtensionProps {
  bundleName: string;
  urlParamKey: string;
  id: string;
  checked: boolean;
  canDeleteFromPopup: boolean;
}

interface OptionsExtensionProps extends BaseExtensionProps {
  url: string;
  urlParamValue: string;
}

type ExtensionItems = 'QueryParamsBuilderOptions' | 'QueryParamsBuilderTab';

type ExtensionActions =
  | 'GET_STORAGE'
  | 'SET_STORAGE'
  | 'GET_CURRENT_TAB'
  | 'UPDATE_URL_TAB'
  | 'REMOVE_ALL_STORAGE';

type GetStorageSyncCallback = (items: {
  [key in ExtensionItems]: OptionsExtensionProps[] | BaseExtensionProps[];
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

type OptionsValue = BaseExtensionProps[];
type TabsValue = { [key: string]: OptionsExtensionProps[] };
type SyncStorage = OptionsValue | TabsValue;

interface API {
  setStorage: (key: ExtensionItems, value: SyncStorage) => Promise<void>;
  setStorageSync: (key: ExtensionItems, value: SyncStorage) => void;
  getStorage: (
    key: ExtensionItems
  ) => Promise<{ [key in ExtensionItems]?: SyncStorage }>;
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

type PopupActions = 'deleteTabItem' | 'applyUrlParams' | 'addNewTabBundle';

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

type UpdateOptionsPopup = (options: BaseExtensionProps[]) => void;

interface OptionsContext {
  options: BaseExtensionProps[];
  setOptions: React.Dispatch<React.SetStateAction<BaseExtensionProps[]>>;
  toast: Toast;
  setToast: React.Dispatch<React.SetStateAction<Toast>>;
  updateAction: UpdateActions;
  setUpdateAction: React.Dispatch<React.SetStateAction<UpdateActions>>;
}

interface PopupContext {
  currentTab: chrome.tabs.Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<chrome.tabs.Tab>>;
  options: OptionsExtensionProps[];
  setOptions: React.Dispatch<
    React.SetStateAction<OptionsExtensionProps[] | BaseExtensionProps[]>
  >;
  updateAction: PopupActions;
  setUpdateAction: React.Dispatch<React.SetStateAction<PopupActions>>;
}

interface FormProps {
  onSubmitHandler: (event: FormEvent<Element>) => void;
}

interface OptionsTableBodyProps {
  deleteHandler: (event: MouseEvent<Element>) => void;
  editHandler: (event: MouseEvent<Element>) => void;
}
