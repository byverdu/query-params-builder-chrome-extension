import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { OptionsApp } from '../../../src/react/pages/options/OptionsApp.jsx';

let container, toastContainer, form, bundleName, urlParamKey;

beforeEach(() => {
  container = render(<OptionsApp />).container;
  toastContainer = container.querySelector('.toast');
  form = container.querySelector('form');
  const inputs = container.querySelectorAll('input');
  bundleName = inputs[0];
  urlParamKey = inputs[1];
});

describe('Options', () => {
  it('should render the title', () => {
    expect(container.querySelector('h1').textContent).toEqual(
      'QueryParamsBuilder Options'
    );
  });

  it('should render the toast for restored options', async () => {
    expect(toastContainer).toBeInTheDocument();

    await waitFor(() => {
      expect(toastContainer.querySelector('.toast-body').textContent).toEqual(
        'Options Restored Successfully'
      );
    });
  });

  it('should render the form', () => {
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should save an option and render it on the table', async () => {
    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    const [firstTd, secondTd] = container.querySelectorAll('tbody tr td');

    expect(firstTd.textContent).toEqual('API key');
    expect(secondTd.textContent).toEqual('apiKey');
    await waitFor(() => {
      expect(toastContainer.querySelector('.toast-body').textContent).toEqual(
        'New option saved Successfully'
      );
    });
  });

  it('should display the invalid state', () => {
    const button = container.querySelector('#addBundle');

    fireEvent.click(button);

    expect(bundleName.className).toMatch(/is-invalid/);
    expect(bundleName.placeholder).toEqual('This value can not be empty');
  });

  it('should remove the invalid state after the form is submitted', () => {
    const button = container.querySelector('#addBundle');

    fireEvent.click(button);

    expect(bundleName.className).toMatch(/is-invalid/);
    expect(bundleName.placeholder).toEqual('This value can not be empty');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    expect(bundleName.className).not.toMatch(/is-invalid/);
  });

  it('should edit values when a <td> is blurred', async () => {
    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    const bundleNameEdit = container.querySelector(
      '[data-value-type="bundleName"]'
    );

    fireEvent.input(bundleNameEdit, {
      target: { textContent: 'new name' },
    });

    fireEvent.blur(bundleNameEdit);

    expect(bundleNameEdit.textContent).toEqual('new name');
    await waitFor(() => {
      expect(toastContainer.querySelector('.toast-body').textContent).toEqual(
        'Option updated Successfully'
      );
    });
  });

  it('should handle delete a bundle', async () => {
    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    const [bundleNameValue, urlParamKeyValue] =
      container.querySelectorAll('td');
    const deleteBtn = container.querySelector('.delete-bundle');

    expect(bundleNameValue.textContent).toEqual('API key');
    expect(urlParamKeyValue.textContent).toEqual('apiKey');

    fireEvent.click(deleteBtn);

    const [bundleNameValueEmpty] = container.querySelectorAll('td');

    expect(bundleNameValueEmpty.textContent).toEqual('Add some bundles!');
    await waitFor(() => {
      expect(toastContainer.querySelector('.toast-body').textContent).toEqual(
        'Option deleted Successfully'
      );
    });
  });

  it('should delete all the options', async () => {
    const deleteBtn = container.querySelector('#removeAll');

    fireEvent.change(bundleName, { target: { value: 'API key' } });
    fireEvent.change(urlParamKey, { target: { value: 'apiKey' } });
    fireEvent.submit(form);

    const [bundleNameValue, urlParamKeyValue] =
      container.querySelectorAll('td');

    expect(bundleNameValue.textContent).toEqual('API key');
    expect(urlParamKeyValue.textContent).toEqual('apiKey');

    fireEvent.click(deleteBtn);

    const [bundleNameValueEmpty] = container.querySelectorAll('td');

    expect(bundleNameValueEmpty.textContent).toEqual('Add some bundles!');
    await waitFor(() => {
      expect(toastContainer.querySelector('.toast-body').textContent).toEqual(
        'All options deleted Successfully'
      );
    });
  });
});
