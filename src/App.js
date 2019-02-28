
import React, { PureComponent } from 'react';
import cx from 'classnames'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import makeSpongebobAppear from './makeSpongebobAppear'
import './App.css';
import KeyIcon from '@material-ui/icons/VpnKey'
import Button from '@material-ui/core/Button'
import Settings from './Settings'

import MonitorBar from './MonitorBar'
import TopicMonitor from './TopicMonitor'

class App extends PureComponent {
  state = {
    subscribeState: null, // 'preparing', 'subscribed'
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
          <MonitorBar />

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

export default compose(
  connect(mapStateToProps),
  withSnackbar,
)(App)
