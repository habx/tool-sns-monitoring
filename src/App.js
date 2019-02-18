import React, { PureComponent } from 'react';
import cx from 'classnames'
import { connect } from 'react-redux'
import makeSpongebobAppear from './makeSpongebobAppear'
import './App.css';
import KeyIcon from '@material-ui/icons/VpnKey'
import Button from '@material-ui/core/Button'
import Settings from './Settings'

import MonitorBar from './MonitorBar'
import TopicMonitor from './TopicMonitor'

window.isWindowFocused = document.hasFocus()
const onWindowFocus = () => window.isWindowFocused = true
const onWindowBlur = () => window.isWindowFocused = false
window.addEventListener('focus', onWindowFocus)
window.addEventListener('blur', onWindowBlur)

class App extends PureComponent {
  state = {
    subscribeState: null, // 'preparing', 'subscribed'
    awsEnv: null,
    showSettingsPage: false,
  }

  componentWillMount() {
    this.randomSpongebob()
  }

  randomSpongebob() {
    const hours = Math.floor(Math.random() * 3) + 1
    const interval = hours * 3600 * 1000
    setTimeout(() => this.spongebobThenRandomSpongebob(), interval)
  }
  spongebobThenRandomSpongebob() {
    makeSpongebobAppear()
    this.randomSpongebob()
  }

  onSubscribeStateChange = (newState) => this.setState({ subscribeState: newState })
  topicMonitorRef = (el) => this.topicMonitorInstance = el

  openSettings = () => this.setState({ showSettingsPage: true })
  closeSettings = () => this.setState({ showSettingsPage: false })

  render() {
    const { subscribeState, showSettingsPage } = this.state
    const { topicMonitored, isSetUp, namespace, awsCredentials } = this.props

    let monitorKey = 'no'
    if (awsCredentials) {
      monitorKey = `${topicMonitored}:${awsCredentials.accountId}:${awsCredentials.region}:${awsCredentials.accessKeyId}:${awsCredentials.secretAccessKey}:${namespace}`
    }

    return (
      <div className="App">
        {(!isSetUp || showSettingsPage) && (
          <Settings
            canClose={isSetUp}
            onClose={this.closeSettings}
          />
        )}

        <div className="FixedTopBar">
          <Button className="SettingsButton" onClick={this.openSettings}>
            <KeyIcon />
          </Button>
          {topicMonitored !== null && (
            <p className="MonitoringState">
              We monitor {topicMonitored}<br />
              State: {subscribeState} <span className={cx('MonitoringState-dot', subscribeState === 'subscribed' && 'success')}></span>
            </p> )}

          <MonitorBar />

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
            key={monitorKey}
            topic={topicMonitored}
            onSubscribeStateChange={this.onSubscribeStateChange}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ topicMonitored, awsCredentials, namespace }) => ({
  topicMonitored,
  isSetUp: !!awsCredentials && !!namespace,
  namespace,
  awsCredentials,
})

export default connect(mapStateToProps)(App)
