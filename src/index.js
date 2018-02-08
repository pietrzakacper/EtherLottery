import React from 'react'
import {render} from 'react-dom'

import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import reducer from './reducer.js'
import rootSaga from './sagas'

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

import App from './containers/App'


const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  applyMiddleware(
    sagaMiddleware,
    logger
  )
)

sagaMiddleware.run(rootSaga)

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

render(
  <MuiThemeProvider theme={theme}>
    <div>
      <Reboot/>
      <Provider store={store}>
        <App />
      </Provider>
    </div>
  </MuiThemeProvider>,
  document.getElementById('root')
);
