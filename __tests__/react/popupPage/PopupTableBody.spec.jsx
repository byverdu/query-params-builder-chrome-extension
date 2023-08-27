import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { PopupTableBody } from '../../../src/react/components/PopupTableBody';
import { renderer } from './PopupCustomRenderer';

const setOptions = jest.fn();
const setUpdateAction = jest.fn();
const buildContainer = options =>
  renderer({
    component: () => <PopupTableBody />,
    mockedProps: { options, setOptions, setUpdateAction },
  });
const option = {
  checked: false,
  canDeleteFromPopup: false,
  id: '1234',
  bundleName: 'API key',
  urlParamKey: 'apiKey',
};
const tab = {
  checked: false,
  canDeleteFromPopup: true,
  id: '5678',
  bundleName: 'some secret',
  urlParamKey: 'someSecret',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PopupTableBody', () => {
  it('should render nothing if no options are available', () => {
    const container = buildContainer(undefined);

    expect(container.querySelector('table')).not.toBeInTheDocument();
  });

  it("should render a message if there're no options saved", () => {
    const container = buildContainer([]);

    expect(container.querySelector('tr td').textContent).toEqual(
      'Add some bundles!'
    );
  });

  it('should render 2 <td> if item can not be deleted', () => {
    const container = buildContainer([option]);
    const tableDefinitions = container.querySelectorAll('tr td');
    const [bundleName, urlParamKey] = tableDefinitions;

    expect(tableDefinitions).toHaveLength(2);
    expect(bundleName.textContent).toEqual('API key');
    expect(urlParamKey.textContent).toEqual('');
  });

  it('should render 3 <td> if item can be deleted', () => {
    const container = buildContainer([tab]);
    const tableDefinitions = container.querySelectorAll('tr td');
    const [bundleName, urlParamKey, deleteBtn] = tableDefinitions;

    expect(tableDefinitions).toHaveLength(3);
    expect(bundleName.textContent).toEqual('some secret');
    expect(urlParamKey.textContent).toEqual('');
    expect(deleteBtn.textContent).toEqual('-');
  });

  it("should render <td>'s from options and tabs", () => {
    const container = buildContainer([option, tab]);
    const tableDefinitions = container.querySelectorAll('tr td');
    const [optionBundleName, , tabBundleName] = tableDefinitions;

    expect(tableDefinitions).toHaveLength(5);
    expect(optionBundleName.textContent).toEqual('API key');
    expect(tabBundleName.textContent).toEqual('some secret');
  });

  it('should only delete a bundle if the id matches', () => {
    const container = buildContainer([option, tab]);
    const tableRows = container.querySelectorAll('tr');
    const [, tabsRow] = tableRows;
    const deleteBtn = tabsRow.querySelector('button');

    delete deleteBtn.dataset.bundleId;

    expect(tableRows).toHaveLength(2);

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(0);
    expect(setUpdateAction).toBeCalledTimes(0);
  });

  it('should be able to delete the tabs options', () => {
    const container = buildContainer([option, tab]);
    const tableRows = container.querySelectorAll('tr');
    const [, tabsRow] = tableRows;
    const deleteBtn = tabsRow.querySelector('button');

    expect(tableRows).toHaveLength(2);

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([option]);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('deleteTabItem');
  });
});
