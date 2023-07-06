import { when } from 'jest-when';
import {
  sendMessageCatchHandler,
  fetchTabStorage,
} from '../../src/react/utils/index.js';
import * as api from '../../src/extension/utils/api.js';

jest.mock('../../src/extension/utils/api.js');

const setToast = jest.fn();
/**
 * @type {ExtensionProps}
 */
const optionsItem = {
  url: 'someUrl',
  urlParamKey: 'apiKey',
  urlParamValue: 'someSecret',
  bundleName: 'API key',
  canDeleteFromPopup: false,
  checked: false,
  id: 'someId',
};
/**
 * @type {ExtensionProps}
 */
const tabsItem = {
  url: 'someUrl',
  urlParamKey: 'apiKey',
  urlParamValue: 'someSecret',
  bundleName: 'API key',
  canDeleteFromPopup: true,
  checked: false,
  id: 'someId-2',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('react utils', () => {
  describe('sendMessageCatchHandler', () => {
    const error = new Error('catch error');
    it('should be defined', () => {
      expect(sendMessageCatchHandler).toBeInstanceOf(Function);
    });
    it('should call console.error', () => {
      jest.spyOn(console, 'error');

      sendMessageCatchHandler(setToast, error, 'deleteAll');

      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith(
        'QueryParamsBuilder extension deleteAll',
        'Error: catch error'
      );
    });
    it('should call the function passed as argument', () => {
      sendMessageCatchHandler(setToast, error, 'deleteAll');

      expect(setToast).toBeCalledTimes(1);
      expect(setToast).toBeCalledWith({ type: 'danger', text: 'catch error' });
    });
  });

  describe('fetchTabStorage', () => {
    const sendMessageTabs = {
      type: api.GET_STORAGE,
      payload: { key: api.TABS_ITEM },
    };
    const sendMessageOptions = {
      type: api.GET_STORAGE,
      payload: { key: api.OPTIONS_ITEM },
    };

    beforeEach(() => {
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageOptions)
        .mockResolvedValue(Promise.resolve([optionsItem]));
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageTabs)
        .mockResolvedValue(Promise.resolve({ someUrl: [tabsItem] }));
    });

    it('should be defined', () => {
      expect(fetchTabStorage).toBeInstanceOf(Function);
    });

    it('should call api.extensionApi.sendMessage twice', async () => {
      jest.spyOn(api.extensionApi, 'sendMessage');
      await fetchTabStorage('someUrl');

      expect(api.extensionApi.sendMessage).toBeCalledTimes(2);
      expect(api.extensionApi.sendMessage).nthCalledWith(1, sendMessageTabs);
      expect(api.extensionApi.sendMessage).nthCalledWith(2, sendMessageOptions);
    });

    it('should return the options if no url has been saved', async () => {
      jest.spyOn(api.extensionApi, 'sendMessage');
      await expect(fetchTabStorage('anotherUrl')).resolves.toMatchObject([
        optionsItem,
      ]);
    });

    it('should return the options and tabs if url has been saved', async () => {
      jest.spyOn(api.extensionApi, 'sendMessage');
      await expect(fetchTabStorage('someUrl')).resolves.toMatchObject([
        tabsItem,
        optionsItem,
      ]);
    });

    it('should return the tabs if url has been saved and ids match', async () => {
      tabsItem.id = 'someId';
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageTabs)
        .mockResolvedValue(Promise.resolve({ someUrl: [tabsItem] }));

      await expect(fetchTabStorage('someUrl')).resolves.toMatchObject([
        tabsItem,
      ]);
    });

    it('should return empty array if options are null', async () => {
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageOptions)
        .mockResolvedValue(Promise.resolve(null));
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageTabs)
        .mockResolvedValue(Promise.resolve(null));

      await expect(fetchTabStorage('someUrl')).resolves.toEqual([]);
    });

    it('should return options if tabs are null', async () => {
      when(api.extensionApi.sendMessage)
        .calledWith(sendMessageTabs)
        .mockResolvedValue(Promise.resolve({ someUrl: {} }));

      await expect(fetchTabStorage('someUrl')).resolves.toMatchObject([
        optionsItem,
      ]);
    });
  });
});
