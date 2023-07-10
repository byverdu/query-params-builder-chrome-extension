import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Options } from '../../../src/react/pages/options/Options.jsx';
import { OptionsCustomRenderer } from './OptionsCustomRenderer';

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
    const newOptions = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '5678',
        bundleName: 'API key',
        urlParamKey: 'apiKey',
      },
    ];
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
    expect(setOptions).toBeCalledWith(newOptions);
    expect(setUpdateAction).toBeCalledTimes(1);
    expect(setUpdateAction).toBeCalledWith('saveNewOption');

    mockedProps.options = newOptions;

    rerender(
      <OptionsCustomRenderer mockedProps={{ ...mockedProps }}>
        <Options />
      </OptionsCustomRenderer>
    );

    const [firstTd, secondTd] = container.querySelectorAll('tbody tr td');

    expect(firstTd.textContent).toEqual('API key');
    expect(secondTd.textContent).toEqual('apiKey');
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
