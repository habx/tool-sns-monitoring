// @flow

import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import type { PersistState } from 'redux-persist/lib/types.js.flow'
import storage from 'redux-persist/lib/storage'
import appReducer from './actions'

import type { AppState, AppAction } from './types/ActionsAndStore'
import type { Store } from 'redux'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['namespace', 'awsCredentials', 'topicMonitored'],
}

type PersistPartial = { _persist: PersistState }
const persistedReducer = persistReducer(persistConfig, appReducer)

const store: Store<AppState, AppAction> = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }
