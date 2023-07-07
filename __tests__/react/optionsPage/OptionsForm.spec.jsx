import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OptionsForm } from '../../../src/react/components/OptionsForm';
import CustomRenderer from './OptionsCustomRenderer';

describe('OptionsForm', () => {
  it('should render a form', () => {
    const { container } = render(
      <CustomRenderer>
        <OptionsForm />
      </CustomRenderer>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should render 2 inputs', () => {
    const { container } = render(
      <CustomRenderer>
        <OptionsForm />
      </CustomRenderer>
    );
    const inputs = container.querySelectorAll('input');

    expect(inputs).toHaveLength(2);
    expect(inputs[0].id).toEqual('bundleName');
    expect(inputs[1].id).toEqual('urlParamKey');
  });

  it('should trigger invalid event if inputs are not filled', () => {
    const { container } = render(
      <CustomRenderer>
        <OptionsForm />
      </CustomRenderer>
    );
    const button = container.querySelector('#addBundle');
    const input = container.querySelector('input');

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(input.className).toMatch(/is-invalid/);
    expect(input.placeholder).toEqual('This value can not be empty');
  });

  it('should update the options after the form is submit', () => {
    const options = [
      {
        checked: false,
        canDeleteFromPopup: false,
        id: '1234',
        bundleName: 'bundle description',
        urlParamKey: 'someBundle',
      },
    ];
    const result = {
      checked: false,
      canDeleteFromPopup: false,
      id: '5678',
      bundleName: 'API key',
      urlParamKey: 'apiKey',
    };
    const updateOptions = jest.fn();

    const { container } = render(
      <CustomRenderer mockedProps={{ options, updateOptions }}>
        <OptionsForm />
      </CustomRenderer>
    );
    const form = container.querySelector('form');
    const [bundleName, urlParamKey] = container.querySelectorAll('input');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    expect(bundleName.value).toEqual('API key');
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    expect(urlParamKey.value).toEqual('apiKey');
    fireEvent.submit(form);

    expect(updateOptions).toBeCalledTimes(1);
    expect(updateOptions).toBeCalledWith([...options, result], 'saveNewOption');
  });
});
