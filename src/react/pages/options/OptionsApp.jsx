import React, { useState } from 'react';
import { OptionsProvider } from './OptionsContext.jsx';
import { Options } from './Options.jsx';

export const OptionsApp = () => {
  /**
   * @type {UseState<Toast>}
   */
  const [toast, setToast] = useState({
    type: undefined,
    text: undefined,
  });
  /**
   * @type {UseState<BaseExtensionProps[]>}
   */
  const [options, setOptions] = useState([]);
  /**
   * @type {UseState<UpdateActions>}
   */
  const [updateAction, setUpdateAction] = useState();

  return (
    <OptionsProvider
      toast={toast}
      setToast={setToast}
      options={options}
      setOptions={setOptions}
      updateAction={updateAction}
      setUpdateAction={setUpdateAction}
    >
      <Options />
    </OptionsProvider>
  );
};
