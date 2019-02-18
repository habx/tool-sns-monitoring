
import { createActions, handleActions } from 'redux-actions'

const {
  setTopicMonitored,
  setAwsCredentials,
  setNamespace,
} = createActions(
  {},
  'SET_TOPIC_MONITORED',
  'SET_AWS_CREDENTIALS',
  'SET_NAMESPACE',
)

const appInitialState = {
  topicMonitored: null,
  awsCredentials: null,
  namespace: null,
}

const appReducer = handleActions({
  SET_TOPIC_MONITORED: (state, action) => ({ ...state, topicMonitored: action.payload }),
  SET_AWS_CREDENTIALS: (state, action) => ({ ...state, awsCredentials: action.payload }),
  SET_NAMESPACE: (state, action) => ({ ...state, namespace: action.payload }),
}, appInitialState)

export default appReducer
export {
  setTopicMonitored,
  setAwsCredentials,
  setNamespace,
}
