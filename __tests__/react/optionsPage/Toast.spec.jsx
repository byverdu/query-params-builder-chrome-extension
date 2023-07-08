import React from 'react';
import { Toast } from '../../../src/react/components/Toast';
import { renderer } from './OptionsCustomRenderer';

describe('Toast', () => {
  it.each([
    ['success', 'all data saved'],
    ['danger', 'something went wrong'],
  ])('should render the toast with the passed options', (type, text) => {
    const container = renderer({
      component: () => <Toast />,
      mockedProps: { toast: { type, text } },
    });
    const headerText = {
      success: 'Success!',
      danger: 'Error!',
    }[type];

    const className = new RegExp(`text-bg-${type}`);
    const header = container.querySelector('.toast-header span');

    expect(header.className).toMatch(className);
    expect(header.textContent).toEqual(headerText);
    expect(container.querySelector('.toast-body').textContent).toEqual(text);
  });

  it('should show the toast element', () => {
    const container = renderer({
      component: () => <Toast />,
      mockedProps: { toast: { type: 'success', text: 'any text' } },
    });

    expect(container.querySelector('.toast').className).toMatch(/show/);
  });

  it('should remove the toast element after 3 seconds', () => {
    jest.useFakeTimers();
    jest.spyOn(window, 'setTimeout');

    const container = renderer({
      component: () => <Toast />,
      mockedProps: { toast: { type: 'success', text: 'any text' } },
    });

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);

    jest.runAllTimers();

    expect(container.querySelector('.toast').className).not.toMatch(/show/);
  });
});
