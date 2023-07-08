import { render } from '@testing-library/react';
import React from 'react';
import { OptionContext } from '../../../src/react/pages/options/context.jsx';

/**
 * @param {{component: () => React.JSX.Element,mockedProps?: OptionsContext}} props
 * @returns {Element}
 */

export const renderer = ({ mockedProps, component }) => {
  const child = component();

  const Wrapper = () => (
    <OptionContext.Provider value={{ ...mockedProps }}>
      {child}
    </OptionContext.Provider>
  );

  const { container } = render(<Wrapper />);

  return container;
};
