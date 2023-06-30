import React from 'react';
import { createRoot } from 'react-dom/client';

const Options = () => {
  return <div>Options Page</div>;
};

const container = document.getElementById('root');

createRoot(container).render(<Options />);
