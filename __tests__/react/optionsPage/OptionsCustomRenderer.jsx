import React from 'react';
import { OptionContext } from '../../../src/react/pages/options/context.jsx';

/**
 * @param {{children: React.JSX.Element, mockedProps?: OptionsContext}} props
 * @returns {React.JSX.Element}
 */
const CustomRenderer = ({ children, mockedProps }) => (
  <OptionContext.Provider value={{ ...mockedProps }}>
    {children}
  </OptionContext.Provider>
);

export default CustomRenderer;
