// @flow
/*
 * Store State
 */
import type { PersistState } from 'redux-persist/lib/types.js.flow'
export type MyAppState = {|
  topicMonitored: ?string,
  awsCredentials: ?AwsCredentialsState,
  namespace: ?string,
|};
export type ReduxPersistState = {|
  _persist: PersistState,
|};
export type AppState = $ReadOnly<{| ...MyAppState, ...ReduxPersistState |}>

export type AwsCredentialsState = $ReadOnly<{|
  accountId: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
|}>;


/*
 * Actions and Actions Creators
 */
export type SetTopicMonitoredAction = {| type: 'SET_TOPIC_MONITORED', payload: ?string |};
export type SetAwsCredentialsAction = {| type: 'SET_AWS_CREDENTIALS', payload: AwsCredentialsState |};
export type SetNamespaceAction = {| type: 'SET_NAMESPACE', payload: string |};

export type SetTopicMonitoredActionCreator = ($PropertyType<SetTopicMonitoredAction, 'payload'>) => SetTopicMonitoredAction;
export type SetAwsCredentialsActionCreator = ($PropertyType<SetAwsCredentialsAction, 'payload'>) => SetAwsCredentialsAction;
export type SetNamespaceActionCreator = ($PropertyType<SetNamespaceAction, 'payload'>) => SetNamespaceAction;

export type AppAction =
  | SetNamespaceAction
  | SetAwsCredentialsAction
  | SetNamespaceAction
