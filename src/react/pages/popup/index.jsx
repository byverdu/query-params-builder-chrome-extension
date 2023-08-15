import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './Popup.jsx';

import { PopupProvider } from './PopupContext.jsx';

const App = () => {
  /**
   * @type {UseState<chrome.tabs.Tab>}
   */
  const [currentTab, setCurrentTab] = useState(null);
  const [options, setOptions] = useState([]);
  /**
   * @type {UseState<UpdateActions>}
   */
  const [updateAction, setUpdateAction] = useState();

  return (
    <PopupProvider
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      options={options}
      setOptions={setOptions}
      updateAction={updateAction}
      setUpdateAction={setUpdateAction}
    >
      <Popup />
    </PopupProvider>
  );
};

createRoot(document.getElementById('root')).render(<App />);
