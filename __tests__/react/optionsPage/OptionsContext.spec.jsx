import React, { useContext } from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Options } from '../../../src/react/pages/options/Options.jsx';
import * as api from '../../../src/extension/utils/api.js';
import {
  OptionContext,
  AppProvider,
} from '../../../src/react/pages/options/OptionsContext';

jest.mock('../../../src/extension/utils/api.js');

const setUpdateAction = jest.fn();
const setToast = jest.fn();
const setOptions = jest.fn();
const initialState = {
  options: [],
  setOptions,
  toast: { type: undefined, text: undefined },
  setToast,
  updateAction: undefined,
  setUpdateAction,
};

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(api.extensionApi, 'sendMessage')
    .mockResolvedValue([{ bundleName: 'api key' }]);
});

describe('Options', () => {
  it('should set the state with the initial context', () => {
    const { result } = renderHook(() => useContext(OptionContext));

    expect(result.current).toEqual({
      options: [],
      setOptions: expect.any(Function),
      toast: { type: undefined, text: undefined },
      setToast: expect.any(Function),
      updateAction: undefined,
      setUpdateAction: expect.any(Function),
    });
  });

  it('should call api.sendMessage on the first render and set the options', async () => {
    const { rerender } = render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    await rerender(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    expect(api.extensionApi.sendMessage).toBeCalledTimes(1);
    expect(api.extensionApi.sendMessage).toBeCalledWith({
      type: api.GET_STORAGE,
      payload: {
        value: api.OPTIONS_ITEM,
      },
    });
    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([{ bundleName: 'api key' }]);
    expect(setToast).toBeCalledTimes(1);
    expect(setToast).toBeCalledWith({
      type: 'success',
      text: 'Options Restored Successfully',
    });
  });

  it('should call api.sendMessage when a new option is added', async () => {
    const newOption = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'Bundle name',
        urlParamKey: 'bundleName',
      },
    ];

    const { rerender, container } = render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    const form = container.querySelector('form');
    const [bundleName, urlParamKey] = container.querySelectorAll('input');

    fireEvent.change(bundleName, { target: { value: 'Bundle name' } });
    expect(bundleName.value).toEqual('Bundle name');
    fireEvent.change(urlParamKey, { target: { value: 'bundleName' } });
    expect(urlParamKey.value).toEqual('bundleName');
    fireEvent.submit(form);

    expect(setOptions).toHaveBeenCalledTimes(1);
    expect(setOptions).toBeCalledWith(expect.any(Function));

    initialState.options = newOption;
    initialState.updateAction = 'saveNewOption';
    await rerender(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    expect(api.extensionApi.sendMessage).toHaveBeenCalledTimes(2);
    expect(api.extensionApi.sendMessage).nthCalledWith(1, {
      type: api.GET_STORAGE,
      payload: {
        value: api.OPTIONS_ITEM,
      },
    });
    expect(api.extensionApi.sendMessage).nthCalledWith(2, {
      type: api.SET_STORAGE,
      payload: {
        key: api.OPTIONS_ITEM,
        value: newOption,
      },
    });

    expect(setToast).toHaveBeenCalledTimes(2);
    expect(setToast).nthCalledWith(1, {
      type: 'success',
      text: 'Options Restored Successfully',
    });
    expect(setToast).nthCalledWith(2, {
      type: 'success',
      text: 'New option saved Successfully',
    });
  });

  it('should call api.sendMessage when an option is updated', async () => {
    const updatedOption = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'new name',
        urlParamKey: 'newName',
      },
    ];

    initialState.options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'Bundle name',
        urlParamKey: 'bundleName',
      },
    ];

    const { rerender, container } = render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    const bundleName = container.querySelector(
      '[data-value-type="bundleName"]'
    );
    const urlParamKey = container.querySelector(
      '[data-value-type="urlParamKey"]'
    );

    act(() => {
      fireEvent.input(bundleName, {
        target: { textContent: 'new name' },
      });
      fireEvent.input(urlParamKey, {
        target: { textContent: 'newName' },
      });
    });

    expect(bundleName.textContent).toEqual('new name');
    expect(urlParamKey.textContent).toEqual('newName');

    initialState.options = updatedOption;
    initialState.updateAction = 'updateOption';
    await rerender(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    expect(api.extensionApi.sendMessage).toBeCalledWith({
      type: api.SET_STORAGE,
      payload: {
        key: api.OPTIONS_ITEM,
        value: updatedOption,
      },
    });
    expect(setToast).toBeCalledWith({
      type: 'success',
      text: 'Option updated Successfully',
    });
  });

  it('should call api.sendMessage when an option is deleted', async () => {
    initialState.options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'Bundle name',
        urlParamKey: 'bundleName',
      },
    ];

    const { rerender, container } = render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    const deleteBtn = container.querySelector('.delete-bundle');

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledWith(expect.any(Function));
    expect(setUpdateAction).toBeCalledWith('deleteOption');

    initialState.options = [];
    initialState.updateAction = 'deleteOption';
    await rerender(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    expect(api.extensionApi.sendMessage).toBeCalledWith({
      type: api.SET_STORAGE,
      payload: {
        key: api.OPTIONS_ITEM,
        value: [],
      },
    });
    expect(setToast).toBeCalledWith({
      type: 'success',
      text: 'Option deleted Successfully',
    });
  });

  it('should call api.sendMessage when all options are deleted', async () => {
    initialState.options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'Bundle name',
        urlParamKey: 'bundleName',
      },
    ];

    const { rerender, container } = render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    const deleteBtn = container.querySelector('#removeAll');

    fireEvent.click(deleteBtn);

    expect(setOptions).not.toBeCalled();
    expect(setUpdateAction).toBeCalledWith('deleteAll');

    initialState.options = [];
    initialState.updateAction = 'deleteAll';
    await rerender(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    expect(api.extensionApi.sendMessage).toBeCalledWith({
      type: api.REMOVE_ALL_STORAGE,
      payload: { value: [api.OPTIONS_ITEM, api.TABS_ITEM] },
    });
    expect(setToast).toBeCalledWith({
      type: 'success',
      text: 'All options deleted Successfully',
    });
  });

  it('should show the error toast if restore options fails', async () => {
    jest
      .spyOn(api.extensionApi, 'sendMessage')
      .mockRejectedValue(new Error('failed to restore'));

    render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    await waitFor(() => {
      expect(setToast).toBeCalledWith({
        type: 'danger',
        text: 'GET_STORAGE: failed to restore',
      });
    });
  });

  it('should show the error toast if updateAction fails', async () => {
    jest
      .spyOn(api.extensionApi, 'sendMessage')
      .mockRejectedValue(new Error('sendMessage failed'));

    initialState.updateAction = 'saveNewOption';

    render(
      <AppProvider {...initialState}>
        <Options />
      </AppProvider>
    );

    await waitFor(() => {
      expect(setToast).toBeCalledWith({
        type: 'danger',
        text: 'saveNewOption: sendMessage failed',
      });
    });
  });
});
