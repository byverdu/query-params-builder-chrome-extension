import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { OptionsTableBody } from '../../../src/react/components/OptionsTableBody';
import { renderer } from './OptionsCustomRenderer';

const updateOptions = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('OptionsTableBody', () => {
  it("should render a message if there're no options saved", () => {
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options: [] },
    });

    expect(container.querySelector('tr td').textContent).toEqual(
      'Add some bundles!'
    );
  });

  it('should render 3 <td> when options are provided', () => {
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options },
    });
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
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options },
    });
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
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options, updateOptions },
    });
    const bundleName = container.querySelector(
      '[data-value-type="bundleName"]'
    );

    fireEvent.input(bundleName, {
      target: { textContent: 'new name' },
    });

    fireEvent.blur(bundleName);

    expect(updateOptions).toBeCalledTimes(1);
    expect(updateOptions).toBeCalledWith(
      [
        {
          checked: false,
          canDeleteFromPopup: false,
          id: '1234',
          bundleName: 'new name',
          urlParamKey: 'apiKey',
        },
      ],
      'updateOption'
    );
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
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options, updateOptions },
    });
    const urlParamKey = container.querySelector(
      '[data-value-type="urlParamKey"]'
    );

    fireEvent.input(urlParamKey, {
      target: { textContent: 'newName' },
    });

    fireEvent.blur(urlParamKey);

    expect(updateOptions).toBeCalledTimes(1);
    expect(updateOptions).toBeCalledWith(
      [
        {
          checked: false,
          canDeleteFromPopup: false,
          id: '1234',
          bundleName: 'API key',
          urlParamKey: 'newName',
        },
      ],
      'updateOption'
    );
  });

  it('should delete an option', () => {
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
    const container = renderer({
      component: () => <OptionsTableBody />,
      mockedProps: { options, updateOptions },
    });
    const deleteBtn = container.querySelector('.delete-bundle');

    fireEvent.click(deleteBtn);

    expect(updateOptions).toBeCalledTimes(1);
    expect(updateOptions).toBeCalledWith([], 'deleteOption');
  });
});
