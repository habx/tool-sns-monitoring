import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'whatwg-fetch'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack'
import CloseIcon from '@material-ui/icons/Close'
// import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SnackbarProvider
        maxSnack={3}
        action={[
          <IconButton><CloseIcon /></IconButton>
        ]}
      >
        <App />
      </SnackbarProvider>
    </PersistGate>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
