
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import appReducer from './actions'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['namespace', 'awsCredentials', 'topicMonitored'],
}

const persistedReducer = persistReducer(persistConfig, appReducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }
