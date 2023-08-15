import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './OptionsContext.jsx';
import { Options } from './Options.jsx';

const App = () => {
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
    <AppProvider
      toast={toast}
      setToast={setToast}
      options={options}
      setOptions={setOptions}
      updateAction={updateAction}
      setUpdateAction={setUpdateAction}
    >
      <Options />
    </AppProvider>
  );
};

createRoot(document.getElementById('root')).render(<App />);
