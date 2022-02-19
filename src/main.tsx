import React from 'react';
import ReactDOM from 'react-dom';
import { GeistProvider, CssBaseline } from '@geist-ui/core'

import { App } from './components';


ReactDOM.render(
  <React.StrictMode>
    <GeistProvider>
      <CssBaseline />
      <App />
    </GeistProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
