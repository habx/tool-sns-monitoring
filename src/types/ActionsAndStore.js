
/*
 * Store State
 */
export type AppState = $ReadOnly<{|
  topicMonitored: ?string,
  awsCredentials: ?AwsCredentialsState,
  namespace: ?string,
|}>;

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