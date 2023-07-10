import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { OptionsTableBody } from '../../../src/react/components/OptionsTableBody';
import { renderer } from './OptionsCustomRenderer';

const setOptions = jest.fn();
const setUpdateAction = jest.fn();
const buildContainer = options =>
  renderer({
    component: () => <OptionsTableBody />,
    mockedProps: { options, setOptions, setUpdateAction },
  });
const options = [
  {
    checked: false,
    canDeleteFromPopup: false,
    id: '1234',
    bundleName: 'API key',
    urlParamKey: 'apiKey',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('OptionsTableBody', () => {
  it("should render a message if there're no options saved", () => {
    const container = buildContainer([]);

    expect(container.querySelector('tr td').textContent).toEqual(
      'Add some bundles!'
    );
  });

  it('should render 3 <td> when options are provided', () => {
    const container = buildContainer(options);
    const tableDefinitions = container.querySelectorAll('tr td');
    const [bundleName, urlParamKey, buttonParent] = tableDefinitions;
    const button = buttonParent.children[0];

    expect(tableDefinitions).toHaveLength(3);
    expect(bundleName.textContent).toEqual('API key');
    expect(urlParamKey.textContent).toEqual('apiKey');
    expect(button.tagName).toEqual('BUTTON');
    expect(button.textContent).toEqual('Delete');
  });

  it('should be able to edit the <td>', () => {
    const container = buildContainer(options);
    const bundleName = container.querySelector(
      '[data-value-type="bundleName"]'
    );
    const urlParamKey = container.querySelector(
      '[data-value-type="urlParamKey"]'
    );

    fireEvent.input(bundleName, {
      target: { textContent: 'new name' },
    });
    fireEvent.input(urlParamKey, {
      target: { textContent: 'newName' },
    });

    expect(bundleName.textContent).toEqual('new name');
    expect(urlParamKey.textContent).toEqual('newName');
  });

  it('should save the saved values when the bundleName <td> is blurred', () => {
    const container = buildContainer(options);
    const bundleName = container.querySelector(
      '[data-value-type="bundleName"]'
    );

    fireEvent.input(bundleName, {
      target: { textContent: 'new name' },
    });

    fireEvent.blur(bundleName);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'new name',
        urlParamKey: 'apiKey',
      },
    ]);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('updateOption');
  });

  it('should save the saved values when the urlParamKey <td> is blurred', () => {
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const container = buildContainer(options);

    const urlParamKey = container.querySelector(
      '[data-value-type="urlParamKey"]'
    );

    fireEvent.input(urlParamKey, {
      target: { textContent: 'newName' },
    });

    fireEvent.blur(urlParamKey);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'newName',
      },
    ]);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('updateOption');
  });

  it('should delete an option', () => {
    const container = buildContainer(options);
    const deleteBtn = container.querySelector('.delete-bundle');

    fireEvent.click(deleteBtn);

    expect(setOptions).toBeCalledTimes(1);
    expect(setOptions).toBeCalledWith([]);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('deleteOption');
  });
});
