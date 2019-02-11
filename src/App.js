import React, { Fragment, PureComponent } from 'react';
import logo from './logo.svg';
import cx from 'classnames'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ReplayIcon from '@material-ui/icons/Replay'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import './App.css';

import Message from './Message'
import MonitorBar from './MonitorBar'

import TopicMonitor from './TopicMonitor'

window.isWindowFocused = document.hasFocus()
const onWindowFocus = () => window.isWindowFocused = true
const onWindowBlur = () => window.isWindowFocused = false
window.addEventListener('focus', onWindowFocus)
window.addEventListener('blur', onWindowBlur)

class App extends PureComponent {
  state = {
    topicMonitored: 'local-webhooks-ilyes',
    subscribeState: null, // 'preparing', 'subscribed'
  }

  setTopicMonitored = (topic) => this.setState({ topicMonitored: topic })
  onSubscribeStateChange = (newState) => this.setState({ subscribeState: newState })

  render() {
    const { inputText, topicMonitored, subscribeState } = this.state

    return (
      <div className="App">
        <div className="FixedTopBar">
          <MonitorBar
            topicMonitored={topicMonitored}
            onMonitoredTopicChange={this.setTopicMonitored}
          />

          {topicMonitored !== null && (
            <p className="MonitoringState">
              We monitor {topicMonitored}<br />
              State: {subscribeState} <span className={cx('MonitoringState-dot', subscribeState === 'subscribed' && 'success')}></span>
            </p> )}
        </div>

        <div className="FixedTopBar not-fixed-and-invisible">
          <MonitorBar
            topicMonitored={topicMonitored}
            onMonitoredTopicChange={this.setTopicMonitored}
          />

          {topicMonitored !== null && (
            <p className="MonitoringState">
              We monitor {topicMonitored}<br />
              State: {subscribeState} <span className={cx('MonitoringState-dot', subscribeState === 'subscribed' && 'success')}></span>
            </p> )}
        </div>

        {topicMonitored && (
          <TopicMonitor
            key={topicMonitored}
            topic={topicMonitored}
            onSubscribeStateChange={this.onSubscribeStateChange}
          />
        )}
      </div>
    )
  }
}

export default App
