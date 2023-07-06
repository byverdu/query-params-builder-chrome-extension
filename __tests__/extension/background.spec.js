import { when } from 'jest-when';
import * as api from '../../src/extension/utils/api.js';
import utilsRewire from '../../src/extension/scripts/background.js';

jest.mock('../../src/extension/utils/api.js');

const sendResponse = jest.fn();
const removeTabCallback = jest.fn(data => data);
const onMessageCallback = utilsRewire.__get__('onMessageCallback');
const onRemovedTabHandler = utilsRewire.__get__('onRemovedTabHandler');
const setStorageSyncCallback = utilsRewire.__get__('setStorageSyncCallback');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('onRemovedTab', () => {
  it('should call api.extensionApi.getStorageSync', () => {
    onRemovedTabHandler(12345, removeTabCallback);

    expect(api.extensionApi.getStorageSync).toBeCalledTimes(1);
    expect(api.extensionApi.getStorageSync).toBeCalledWith(
      api.TABS_ITEM,
      expect.any(Function)
    );
  });

  it('should call api.extensionApi.setStorageSync with the new tabs', () => {
    const data = {
      [api.TABS_ITEM]: {
        12345: 'to delete',
        56789: 'will stay',
      },
    };

    setStorageSyncCallback(data, 12345);

    expect(api.extensionApi.setStorageSync).toBeCalledTimes(1);
    expect(api.extensionApi.setStorageSync).toBeCalledWith(api.TABS_ITEM, {
      56789: 'will stay',
    });
  });

  it('should not call api.extensionApi.setStorageSync if no data is retrieved', () => {
    setStorageSyncCallback({}, 12345);

    expect(api.extensionApi.setStorageSync).toBeCalledTimes(0);
  });
});

describe('onMessage', () => {
  it('should call console.info if message.type is not defined', () => {
    jest.spyOn(console, 'info');
    onMessageCallback({}, {});

    expect(console.info).toBeCalledTimes(1);
    expect(console.info).toBeCalledWith(
      'No messages found for QueryParamsBuilderOptions'
    );
  });

  describe('SET_STORAGE', () => {
    it('should call api.setStorage', async () => {
      onMessageCallback(
        {
          type: api.SET_STORAGE,
          payload: {
            key: api.OPTIONS_ITEM,
            value: [],
          },
        },
        {}
      );

      expect(api.extensionApi.setStorage).toBeCalledTimes(1);
      expect(api.extensionApi.setStorage).toBeCalledWith(api.OPTIONS_ITEM, []);
    });
  });
  describe('GET_STORAGE', () => {
    it('should call api.getStorage', async () => {
      when(api.extensionApi.getStorage)
        .calledWith(api.OPTIONS_ITEM)
        .mockResolvedValue({ [api.OPTIONS_ITEM]: [] });

      await onMessageCallback(
        {
          type: api.GET_STORAGE,
          payload: {
            value: api.OPTIONS_ITEM,
          },
        },
        {},
        sendResponse
      );

      expect(api.extensionApi.getStorage).toBeCalledTimes(1);
      expect(api.extensionApi.getStorage).toBeCalledWith(api.OPTIONS_ITEM);
      expect(sendResponse).toBeCalledWith([]);
    });
  });

  describe('GET_CURRENT_TAB', () => {
    it('should call api.getCurrentTab', async () => {
      jest
        .spyOn(api.extensionApi, 'getCurrentTab')
        .mockResolvedValue([{ url: 'someUrl' }]);

      await onMessageCallback(
        {
          type: api.GET_CURRENT_TAB,
        },
        {},
        sendResponse
      );

      expect(api.extensionApi.getCurrentTab).toBeCalledTimes(1);
      expect(sendResponse).toBeCalledWith({ url: 'someUrl' });
    });
  });

  describe('UPDATE_URL_TAB', () => {
    it('should call api.setStorage', async () => {
      jest
        .spyOn(api.extensionApi, 'updateUrlTab')
        .mockResolvedValue({ url: 'newUrl' });

      await onMessageCallback(
        {
          type: api.UPDATE_URL_TAB,
          payload: { value: 'newUrl' },
        },
        {},
        sendResponse
      );

      expect(api.extensionApi.updateUrlTab).toBeCalledTimes(1);
      expect(api.extensionApi.updateUrlTab).toBeCalledWith('newUrl');
      expect(sendResponse).toBeCalledWith({ url: 'newUrl' });
    });
  });

  describe('REMOVE_ALL_STORAGE', () => {
    it('should call api.setStorage', async () => {
      onMessageCallback(
        {
          type: api.REMOVE_ALL_STORAGE,
          payload: { value: [api.TABS_ITEM, api.OPTIONS_ITEM] },
        },
        {},
        sendResponse
      );

      expect(api.extensionApi.removeStorage).toBeCalledTimes(1);
      expect(api.extensionApi.removeStorage).toBeCalledWith([
        api.TABS_ITEM,
        api.OPTIONS_ITEM,
      ]);
    });
  });
});
