import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Options } from '../../../src/react/pages/options/Options.jsx';
import { OptionsCustomRenderer } from './OptionsCustomRenderer';
import * as utils from '../../../src/react/utils/index.js';

jest.mock('../../../src/react/utils/index.js');

const option = {
  checked: false,
  canDeleteFromPopup: false,
  id: '5678',
  bundleName: 'API key',
  urlParamKey: 'apiKey',
};
const setOptions = jest.fn();
const setUpdateAction = jest.fn();
const mockedProps = {
  options: [],
  setOptions,
  setUpdateAction,
  toast: { type: 'success', text: 'any text' },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Options', () => {
  it('should render the title', () => {
    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );
    expect(container.querySelector('h1').textContent).toEqual(
      'QueryParamsBuilder Options'
    );
  });

  it('should render the toast initially', () => {
    const { rerender, container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    rerender(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const toast = container.querySelector('.toast');

    expect(toast).toBeInTheDocument();
    expect(toast.querySelector('.toast-body').textContent).toEqual('any text');
  });

  it('should render the form', () => {
    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should save an option and render it on the table', () => {
    setOptions.mockImplementationOnce(() => utils.updateState([], option));
    const { container, rerender } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const form = container.querySelector('form');
    const [bundleName, urlParamKey] = container.querySelectorAll('input');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    expect(bundleName.value).toEqual('API key');
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    expect(urlParamKey.value).toEqual('apiKey');
    fireEvent.submit(form);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith(expect.any(Function));
    expect(utils.updateState).toBeCalledWith([], option);
    expect(utils.getNewItemToSave).toBeCalledWith('options', form.elements);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('saveNewOption');

    mockedProps.options = [option];

    rerender(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const [firstTd, secondTd] = container.querySelectorAll('tbody tr td');

    expect(firstTd.textContent).toEqual('API key');
    expect(secondTd.textContent).toEqual('apiKey');
  });

  it('should remove the invalid state after the form is submitted', () => {
    const { container, rerender } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const form = container.querySelector('form');
    const button = container.querySelector('#addBundle');
    const [bundleName, urlParamKey] = container.querySelectorAll('input');

    fireEvent.click(button);

    expect(bundleName.className).toMatch(/is-invalid/);
    expect(bundleName.placeholder).toEqual('This value can not be empty');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    expect(bundleName.value).toEqual('API key');
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    expect(urlParamKey.value).toEqual('apiKey');

    fireEvent.submit(form);
    // fireEvent.click(button);

    rerender(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const [bundleName2] = container.querySelectorAll('input');

    expect(bundleName2.className).not.toMatch(/is-invalid/);
    // expect(input.placeholder).toEqual('This value can not be empty');
  });

  it('should edit values when a <td> is blurred', () => {
    const prevState = [option];
    const editValues = {
      id: '5678',
      key: 'bundleName',
      value: 'new name',
    };
    setOptions.mockImplementationOnce(() =>
      utils.editItemFromState(prevState, editValues)
    );

    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const bundleName = container.querySelector(
      '[data-value-type="bundleName"]'
    );

    fireEvent.input(bundleName, {
      target: { textContent: 'new name' },
    });

    fireEvent.blur(bundleName);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith(expect.any(Function));
    expect(utils.editItemFromState).toBeCalledTimes(1);
    expect(utils.editItemFromState).toBeCalledWith(prevState, editValues);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('updateOption');
  });

  it('should handle delete a bundle', () => {
    const prevState = [option];
    const idToDelete = '5678';

    setOptions.mockImplementationOnce(() =>
      utils.removeItemFromState([option], idToDelete)
    );

    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const deleteBtn = container.querySelector('.delete-bundle');

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith(expect.any(Function));
    expect(utils.removeItemFromState).toBeCalledTimes(1);
    expect(utils.removeItemFromState).toBeCalledWith(prevState, idToDelete);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('deleteOption');
  });

  it('should delete all the options', () => {
    mockedProps.options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const deleteBtn = container.querySelector('#removeAll');

    fireEvent.click(deleteBtn);

    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('deleteAll');
  });
});
