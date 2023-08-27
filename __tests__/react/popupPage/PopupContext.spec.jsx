import { when } from 'jest-when';
import React, { useContext } from 'react';
import { render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Popup } from '../../../src/react/pages/popup/Popup.jsx';
import * as api from '../../../src/extension/utils/api.js';
import * as utils from '../../../src/react/utils';
import {
  PopupContext,
  PopupProvider,
} from '../../../src/react/pages/popup/PopupContext';

jest.mock('../../../src/extension/utils/api.js');
jest.mock('../../../src/react/utils');

const setUpdateAction = jest.fn();
const setCurrentTab = jest.fn();
const setOptions = jest.fn();
const initialState = {
  options: [],
  setOptions,
  currentTab: undefined,
  setCurrentTab,
  updateAction: undefined,
  setUpdateAction,
};

beforeEach(() => {
  jest.resetAllMocks();

  when(api.extensionApi.sendMessage)
    .calledWith({ type: 'GET_CURRENT_TAB' })
    .mockResolvedValue({ url: 'someUrl' });
});

describe('PopupContext', () => {
  it('should set the state with the initial context', () => {
    const { result } = renderHook(() => useContext(PopupContext));

    expect(result.current).toEqual({
      options: null,
      setOptions: expect.any(Function),
      currentTab: null,
      setCurrentTab: expect.any(Function),
      updateAction: undefined,
      setUpdateAction: expect.any(Function),
    });
  });

  it('should call api.sendMessage on the first render and set the currentTab', async () => {
    const { rerender } = render(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    await rerender(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    expect(api.extensionApi.sendMessage).toBeCalledTimes(1);
    expect(api.extensionApi.sendMessage).toBeCalledWith({
      type: api.GET_CURRENT_TAB,
    });
    expect(setCurrentTab).toBeCalledTimes(1);
    expect(setCurrentTab).toBeCalledWith({ url: 'someUrl' });
  });

  it('should catch the api.sendMessage errors', done => {
    jest.spyOn(global.console, 'error');

    jest
      .spyOn(api.extensionApi, 'sendMessage')
      .mockRejectedValue(new Error('error getting current tab'));

    render(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    setTimeout(() => {
      expect(api.extensionApi.sendMessage).toBeCalledTimes(1);
      expect(api.extensionApi.sendMessage).toBeCalledWith({
        type: api.GET_CURRENT_TAB,
      });
      expect(setCurrentTab).toBeCalledTimes(0);
      expect(global.console.error).toBeCalledTimes(1);
      expect(global.console.error).toBeCalledWith(
        'QueryParamsBuilder extension GET_CURRENT_TAB',
        'Error: error getting current tab'
      );
      done();
    }, 0);
  });

  it('should call fetchTabStorage once the currentTab is being set', async () => {
    const optionsItem = {
      urlParamKey: 'apiKey',
      bundleName: 'API key',
      canDeleteFromPopup: false,
      checked: false,
      id: 'someId',
    };
    jest
      .spyOn(utils, 'fetchTabStorage')
      .mockReturnValue(Promise.resolve([optionsItem]));

    const { rerender } = render(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    expect(utils.fetchTabStorage).toBeCalledTimes(0);
    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([]);

    initialState.currentTab = { url: 'someUrl' };

    await rerender(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    expect(utils.fetchTabStorage).toBeCalledTimes(1);
    expect(utils.fetchTabStorage).toBeCalledWith('someUrl');
    expect(setOptions).toBeCalledTimes(2);
    expect(setOptions).toBeCalledWith([optionsItem]);
  });

  it('should catch the fetchTabStorage errors', async () => {
    jest.spyOn(global.console, 'error');

    jest
      .spyOn(utils, 'fetchTabStorage')
      .mockRejectedValue(new Error('error fetchTabStorage'));

    initialState.currentTab = { url: 'someUrl' };

    render(
      <PopupProvider {...initialState}>
        <Popup />
      </PopupProvider>
    );

    await waitFor(() => {
      expect(utils.fetchTabStorage).toBeCalledTimes(1);
      expect(utils.fetchTabStorage).toBeCalledWith('someUrl');
      expect(setOptions).toBeCalledTimes(0);
      expect(global.console.error).toBeCalledTimes(1);
      expect(global.console.error).toBeCalledWith(
        'QueryParamsBuilder extension GET_STORAGE',
        'Error: error fetchTabStorage'
      );
    });
  });
});
