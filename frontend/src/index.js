import React from "react";
import ReactDOM from "react-dom/client";
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Theme preset={presetGpnDefault}>
      <App />
    </Theme>
  </React.StrictMode>
);