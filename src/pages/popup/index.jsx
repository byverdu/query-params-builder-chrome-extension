import React from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  return <div>Popup Page</div>;
};

const container = document.getElementById('root');

createRoot(container).render(<Popup />);
