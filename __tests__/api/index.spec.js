import { when } from 'jest-when';
import { extensionApi, SET_STORAGE } from '../../src/extension/utils/api';

const {
  setStorage,
  setStorageSync,
  getStorage,
  getStorageSync,
  sendMessage,
  onRemovedTab,
  onMessage,
  getCurrentTab,
  updateUrlTab,
  removeStorage,
} = extensionApi;

const tabs = [{ id: '123' }];
const tabsStorage = { tabs };

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    when(chrome.storage.sync.get)
      .calledWith('tabs')
      .mockResolvedValue(tabsStorage);
  });

  describe('setStorage', () => {
    it('should be defined', () => {
      expect(setStorage).toBeInstanceOf(Function);
    });

    it('should call chrome.storage.sync.set', async () => {
      await setStorage('tabs', tabs);

      expect(chrome.storage.sync.set).toBeCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(tabsStorage);
    });

    it('should set the sync storage', async () => {
      await setStorage('tabs', tabs);

      await expect(chrome.storage.sync.get('tabs')).resolves.toEqual(
        tabsStorage
      );
    });
  });

  describe('setStorageSync', () => {
    it('should be defined', () => {
      expect(setStorageSync).toBeInstanceOf(Function);
    });

    it('should call chrome.storage.sync.set', () => {
      setStorageSync('tabs', tabs);

      expect(chrome.storage.sync.set).toBeCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(tabsStorage);
    });

    it('should set the sync storage', async () => {
      setStorageSync('tabs', tabs);

      await expect(chrome.storage.sync.get('tabs')).resolves.toEqual(
        tabsStorage
      );
    });
  });

  describe('getStorage', () => {
    it('should be defined', () => {
      expect(getStorage).toBeInstanceOf(Function);
    });

    it('should call chrome.storage.sync.get', async () => {
      await getStorage('tabs');

      expect(chrome.storage.sync.get).toBeCalledTimes(1);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith('tabs');
    });

    it('should get the storage for the given key, "tabs"', async () => {
      await expect(getStorage('tabs')).resolves.toEqual(tabsStorage);
    });

    it('should get the storage for the given key, "crabs"', async () => {
      await expect(getStorage('crabs')).resolves.toEqual(undefined);
    });
  });

  describe('getStorageSync', () => {
    const getStorageCallback = jest.fn(key => {
      return tabsStorage[key];
    });

    it('should be defined', () => {
      expect(getStorageSync).toBeInstanceOf(Function);
    });

    it('should call chrome.storage.sync.get', () => {
      getStorageSync('tabs', getStorageCallback);

      expect(chrome.storage.sync.get).toBeCalledTimes(1);
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(
        'tabs',
        getStorageCallback
      );
    });

    it('should get the storage for the given key, "tabs"', () => {
      chrome.storage.sync.get.mockImplementationOnce((key, cb) => {
        cb(key);
      });

      getStorageSync('tabs', getStorageCallback);

      expect(getStorageCallback).toBeCalledTimes(1);
      expect(getStorageCallback).toBeCalledWith('tabs');
      expect(getStorageCallback).toHaveReturnedWith(tabs);
    });
  });

  describe('sendMessage', () => {
    it('should be defined', () => {
      expect(sendMessage).toBeInstanceOf(Function);
    });

    it('should call chrome.runtime.sendMessage', async () => {
      await sendMessage({
        type: SET_STORAGE,
        payload: [],
      });

      expect(chrome.runtime.sendMessage).toBeCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'SET_STORAGE',
        payload: [],
      });
    });
  });

  describe('onRemovedTab', () => {
    const onRemovedCallback = jest.fn();

    it('should be defined', () => {
      expect(onRemovedTab).toBeInstanceOf(Function);
    });

    it('should call chrome.tabs.onRemoved.addListener', () => {
      onRemovedTab(onRemovedCallback);

      expect(onRemovedCallback).not.toBeCalled();
      expect(chrome.tabs.onRemoved.hasListeners()).toBe(true);

      chrome.tabs.onRemoved.callListeners();

      expect(onRemovedCallback).toBeCalledTimes(1);
    });
  });

  describe('onMessage', () => {
    it('should be defined', () => {
      expect(onMessage).toBeInstanceOf(Function);
    });

    it('should call chrome.runtime.onMessage', () => {
      const listenerSpy = jest.fn();
      const sendResponseSpy = jest.fn();

      onMessage(listenerSpy);

      expect(listenerSpy).not.toBeCalled();
      expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

      chrome.runtime.onMessage.callListeners(
        { greeting: 'hello' }, // message
        {}, // MessageSender object
        sendResponseSpy // SendResponse function
      );

      expect(listenerSpy).toBeCalledWith(
        { greeting: 'hello' },
        {},
        sendResponseSpy
      );
      expect(sendResponseSpy).not.toBeCalled();
    });
  });

  describe('getCurrentTab', () => {
    it('should be defined', () => {
      expect(getCurrentTab).toBeInstanceOf(Function);
    });

    it('should call chrome.tabs.query', async () => {
      await getCurrentTab();

      expect(chrome.tabs.query).toBeCalledTimes(1);
      expect(chrome.tabs.query).toBeCalledWith({
        active: true,
        currentWindow: true,
      });
    });

    it('should return the current tab data', async () => {
      chrome.tabs.query.mockImplementationOnce(() =>
        Promise.resolve({ id: 1234 })
      );

      await expect(getCurrentTab()).resolves.toEqual({ id: 1234 });
    });
  });

  describe('updateUrlTab', () => {
    it('should be defined', () => {
      expect(updateUrlTab).toBeInstanceOf(Function);
    });

    it('should call chrome.tabs.update', async () => {
      await updateUrlTab('newURl');

      expect(chrome.tabs.update).toBeCalledTimes(1);
      expect(chrome.tabs.update).toBeCalledWith({ url: 'newURl' });
    });

    it("should update the tab's url", async () => {
      chrome.tabs.update.mockImplementationOnce(({ url }) =>
        Promise.resolve({ url })
      );

      await expect(updateUrlTab('newURl')).resolves.toEqual({
        url: 'newURl',
      });
    });
  });

  describe('removeStorage', () => {
    it('should be defined', () => {
      expect(removeStorage).toBeInstanceOf(Function);
    });

    it('should call chrome.storage.sync.remove', async () => {
      await removeStorage('tabs');

      expect(chrome.storage.sync.remove).toBeCalledTimes(1);
      expect(chrome.storage.sync.remove).toBeCalledWith('tabs');
    });
  });
});
