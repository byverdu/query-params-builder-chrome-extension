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

let container, form, bundleName, urlParamKey;

beforeEach(() => {
  jest.clearAllMocks();
  container = render(
    <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
      <Options />
    </OptionsCustomRenderer>
  ).container;
  form = container.querySelector('form');
  const inputs = container.querySelectorAll('input');
  bundleName = inputs[0];
  urlParamKey = inputs[1];
});

describe('Options', () => {
  it('should save an option and render it on the table', () => {
    setOptions.mockImplementationOnce(() => utils.updateState([], option));

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith(expect.any(Function));
    expect(utils.updateState).toBeCalledWith([], option);
    expect(utils.getNewItemToSave).toBeCalledWith('options', form.elements);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('saveNewOption');
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

    mockedProps.options = [option];

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

    mockedProps.options = [option];

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

  it('should only delete a bundle if the id matches', () => {
    const tableRows = container.querySelectorAll('tr');
    const [, tabsRow] = tableRows;
    const deleteBtn = tabsRow.querySelector('button');

    delete deleteBtn.dataset.bundleId;

    expect(tableRows).toHaveLength(2);

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(0);
    expect(setUpdateAction).toBeCalledTimes(0);
  });

  it('should delete all the options', () => {
    mockedProps.options = [option];

    const { container } = render(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const deleteBtn = container.querySelector('#removeAll');

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([]);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('deleteAll');
  });
});
