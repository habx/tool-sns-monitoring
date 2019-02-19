// @flow

import { createActions, handleActions } from 'redux-actions'

import type { ReduxReducer } from 'redux-actions'
import type {
  AppAction,
  AppState,
  SetTopicMonitoredAction,
  SetTopicMonitoredActionCreator,
  SetAwsCredentialsAction,
  SetAwsCredentialsActionCreator,
  SetNamespaceAction,
  SetNamespaceActionCreator,
} from './types/ActionsAndStore'

const {
  setTopicMonitored,
  setAwsCredentials,
  setNamespace,
}: {
  setTopicMonitored: SetTopicMonitoredActionCreator,
  setAwsCredentials: SetAwsCredentialsActionCreator,
  setNamespace: SetNamespaceActionCreator,
} = createActions(
  {},
  'SET_TOPIC_MONITORED',
  'SET_AWS_CREDENTIALS',
  'SET_NAMESPACE',
)

const appInitialState: AppState = {
  topicMonitored: null,
  awsCredentials: null,
  namespace: null,
}

const appReducer: ReduxReducer<AppState, AppAction> = handleActions({
  SET_TOPIC_MONITORED: (state: AppState, action: SetTopicMonitoredAction): AppState => ({ ...state, topicMonitored: action.payload }),
  SET_AWS_CREDENTIALS: (state: AppState, action: SetAwsCredentialsAction): AppState => ({ ...state, awsCredentials: action.payload }),
  SET_NAMESPACE: (state: AppState, action: SetNamespaceAction): AppState => ({ ...state, namespace: action.payload }),
}, appInitialState)

export default appReducer
export {
  setTopicMonitored,
  setAwsCredentials,
  setNamespace,
}
