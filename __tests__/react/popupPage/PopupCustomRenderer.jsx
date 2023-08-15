import { render } from '@testing-library/react';
import React from 'react';
import { PopupContext } from '../../../src/react/pages/popup/PopupContext.jsx';

/**
 * @param {{component: () => React.JSX.Element,mockedProps?: PopupContext}} props
 * @returns {Element}
 */
export const renderer = ({ mockedProps, component }) => {
  const child = component();

  const Wrapper = () => (
    <PopupContext.Provider value={{ ...mockedProps }}>
      {child}
    </PopupContext.Provider>
  );

  const { container } = render(<Wrapper />);

  return container;
};

export const PopupCustomRenderer = ({ children, mockedProps }) => (
  <PopupContext.Provider value={{ ...mockedProps }}>
    {children}
  </PopupContext.Provider>
);
