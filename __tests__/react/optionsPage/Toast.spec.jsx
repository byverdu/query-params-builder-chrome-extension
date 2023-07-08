import '@testing-library/jest-dom';
import React from 'react';
import { Toast } from '../../../src/react/components/Toast';
import { renderer } from './OptionsCustomRenderer';

describe('Toast', () => {
  it.each([
    ['success', 'all data saved'],
    ['danger', 'something went wrong'],
  ])('should render the rendered toast html', (type, text) => {
    const container = renderer({
      component: () => <Toast />,
      mockedProps: { toast: { type, text } },
    });

    const className = new RegExp(`text-bg-${type}`);

    expect(container.querySelector('.toast-header span').className).toMatch(
      className
    );
  });
});
