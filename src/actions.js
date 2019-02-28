// @flow

import { createAction, handleActions } from 'redux-actions'

// type _ExtractReturn<B, F: (...args: any[]) => B> = B
// export type ExtractReturn<F> = _ExtractReturn<*, F>

import type { ReduxReducer } from 'redux-actions'
import type {
  AppAction,
  MyAppState,
} from './types/ActionsAndStore'

const SET_TOPIC_MONITORED = 'SET_TOPIC_MONITORED'
const setTopicMonitored = createAction(SET_TOPIC_MONITORED, (topic: string) => topic)
const setAwsCredentials = createAction('SET_AWS_CREDENTIALS')
const setNamespace = createAction<string, ?string>('SET_NAMESPACE')

const appInitialState: MyAppState = {
  topicMonitored: null,
  awsCredentials: null,
  namespace: null,
}


const appReducer: ReduxReducer<MyAppState, AppAction> = handleActions({
  SET_TOPIC_MONITORED: (state: MyAppState, action): MyAppState => ({ ...state, topicMonitored: action.payload }),
  SET_AWS_CREDENTIALS: (state: MyAppState, action: ExtractReturn<typeof setAwsCredentials>): MyAppState => ({ ...state, awsCredentials: action.payload }),
  SET_NAMESPACE: (state: MyAppState, action: ExtractReturn<typeof setNamespace>): MyAppState => ({ ...state, namespace: action.payload }),
}, appInitialState)

export default appReducer
export {
  setTopicMonitored,
  setAwsCredentials,
  setNamespace,
}
