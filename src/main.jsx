import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './theme.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from "material-ui-confirm";

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme = { theme }>
    <ConfirmProvider>
      <CssBaseline/>
      <App />
      <ToastContainer
        position="bottom-left"
        theme="colored"
        autoClose={4000}
      />
    </ConfirmProvider>
  </CssVarsProvider>
  // {/* </React.StrictMode> */}
);
