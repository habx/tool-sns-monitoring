import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'whatwg-fetch'
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack'
import CloseIcon from '@material-ui/icons/Close'
// import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

ReactDOM.render((
  <SnackbarProvider
    maxSnack={3}
    action={[
      <IconButton><CloseIcon /></IconButton>
    ]}
  >
    <App />
  </SnackbarProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
