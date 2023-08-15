import { when } from 'jest-when';
import {
  sendMessageCatchHandler,
  fetchTabStorage,
  sendMessageAsyncHandler,
  updateState,
  getNewItemToSave,
  removeItemFromState,
  editItemFromState,
} from '../../src/react/utils/index.js';
import * as api from '../../src/extension/utils/api.js';

jest.mock('../../src/extension/utils/api.js');

const setToast = jest.fn();
/**
 * @type {BaseExtensionProps}
 */
const optionsItem = {
  urlParamKey: 'apiKey',
  bundleName: 'API key',
  canDeleteFromPopup: false,
  checked: false,
  id: 'someId',
};
/**
 * @type {OptionsExtensionProps}
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

beforeEach(() => {
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
      expect(setToast).toBeCalledWith({
        type: 'danger',
        text: 'deleteAll: catch error',
      });
    });
  });

  describe('sendMessageAsyncHandler', () => {
    it('should be defined', () => {
      expect(sendMessageAsyncHandler).toBeInstanceOf(Function);
    });

    it('should call the functions passed as argument', async () => {
      const promise = new Promise(resolve => {
        resolve('sucess');
      });

      await sendMessageAsyncHandler(promise, setToast, 'all good', 'deleteAll');

      expect(setToast).toBeCalledTimes(1);
      expect(setToast).toBeCalledWith({
        type: 'success',
        text: 'all good',
      });
    });

    it('should call console.error', done => {
      jest.spyOn(console, 'error');

      const promise = new Promise((_, reject) => {
        reject(new Error('sendMessageAsyncHandler catch error'));
      });

      sendMessageAsyncHandler(promise, setToast, 'error.message', 'deleteAll');

      setTimeout(() => {
        expect(console.error).toBeCalledTimes(1);
        expect(console.error).toBeCalledWith(
          'QueryParamsBuilder extension deleteAll',
          'Error: sendMessageAsyncHandler catch error'
        );
        expect(setToast).toBeCalledTimes(1);
        expect(setToast).toBeCalledWith({
          type: 'danger',
          text: 'deleteAll: sendMessageAsyncHandler catch error',
        });
        done();
      }, 0);
    });
  });

  describe('fetchTabStorage', () => {
    const sendMessageTabs = {
      type: api.GET_STORAGE,
      payload: { value: api.TABS_ITEM },
    };
    const sendMessageOptions = {
      type: api.GET_STORAGE,
      payload: { value: api.OPTIONS_ITEM },
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

  describe('updateState', () => {
    it('should be defined', () => {
      expect(updateState).toBeInstanceOf(Function);
    });
    it("should return prevState if it's not an array", () => {
      expect(updateState(2)).toEqual(2);
    });

    it('should update the state', () => {
      expect(updateState([2], 3)).toEqual(expect.arrayContaining([2, 3]));
    });
  });

  describe('removeItemFromState', () => {
    it('should be defined', () => {
      expect(removeItemFromState).toBeInstanceOf(Function);
    });
    it("should return prevState if it's not an array", () => {
      expect(removeItemFromState(2)).toEqual(2);
    });

    it('should update the state', () => {
      expect(removeItemFromState([{ id: '3' }], '3').length).toEqual(0);
    });
  });

  describe('editItemFromState', () => {
    it('should be defined', () => {
      expect(editItemFromState).toBeInstanceOf(Function);
    });
    it("should return prevState if it's not an array", () => {
      expect(editItemFromState(2, {})).toEqual(2);
    });
    it('should edit an item in the state', () => {
      expect(
        editItemFromState([{ id: '3', bundleName: 'api key' }], {
          id: '3',
          key: 'bundleName',
          value: 'new value',
        })
      ).toEqual([{ id: '3', bundleName: 'new value' }]);
    });
  });

  describe('getNewItemToSave', () => {
    let form;
    const inputs = ` <input id="bundleName" value="ApiKey" />
    <input id="bundleName" value="ApiKey" />`;

    beforeEach(() => {
      form = document.createElement('form');
      form.insertAdjacentHTML('afterbegin', inputs);
    });

    it('should be defined', () => {
      expect(getNewItemToSave).toBeInstanceOf(Function);
    });

    it('should generate the item for a options form', () => {
      expect(getNewItemToSave('options', form.elements)).toEqual(
        expect.objectContaining({
          checked: false,
          canDeleteFromPopup: false,
          id: '5678',
          bundleName: 'ApiKey',
        })
      );
    });

    it('should generate the item for a popup form', () => {
      expect(getNewItemToSave('popup', form.elements)).toEqual(
        expect.objectContaining({
          checked: false,
          canDeleteFromPopup: true,
          id: '5678',
          bundleName: 'ApiKey',
        })
      );
    });
  });
});
