import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from '../../../src/react/components/Form';

describe('OptionsForm', () => {
  it('should render a form', () => {
    const { container } = render(<Form />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should render 2 inputs', () => {
    const { container } = render(<Form />);
    const inputs = container.querySelectorAll('input');

    expect(inputs).toHaveLength(2);
    expect(inputs[0].placeholder).toEqual('i.e. API Key');
    expect(inputs[1].placeholder).toEqual('i.e. apiKey');
  });

  it('should trigger invalid event if inputs are not filled', () => {
    const { container } = render(<Form />);
    const button = container.querySelector('#addBundle');
    const input = container.querySelector('input');

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(input.className).toMatch(/is-invalid/);
    expect(input.placeholder).toEqual('This value can not be empty');
  });

  it('should call submit handler', () => {
    const onSubmitHandler = jest.fn();

    const { container } = render(<Form onSubmitHandler={onSubmitHandler} />);

    const form = container.querySelector('form');
    const [bundleName, urlParamKey] = container.querySelectorAll('input');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    expect(bundleName.value).toEqual('API key');
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    expect(urlParamKey.value).toEqual('apiKey');
    fireEvent.submit(form);

    expect(onSubmitHandler).toBeCalledTimes(1);
  });
});
