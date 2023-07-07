import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context.jsx';
import { Options } from './Options.jsx';

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <Options />
  </AppProvider>
);
