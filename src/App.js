import React, { PureComponent } from 'react';
import cx from 'classnames'
import makeSpongebobAppear from './makeSpongebobAppear'
import './App.css';

import MonitorBar from './MonitorBar'
import TopicMonitor from './TopicMonitor'

window.isWindowFocused = document.hasFocus()
const onWindowFocus = () => window.isWindowFocused = true
const onWindowBlur = () => window.isWindowFocused = false
window.addEventListener('focus', onWindowFocus)
window.addEventListener('blur', onWindowBlur)

class App extends PureComponent {
  state = {
    topicMonitored: null,
    subscribeState: null, // 'preparing', 'subscribed'
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

  setTopicMonitored = (topic) => {
    this.setState({ topicMonitored: topic })

  }
  onSubscribeStateChange = (newState) => this.setState({ subscribeState: newState })
  topicMonitorRef = (el) => this.topicMonitorInstance = el

  render() {
    const { topicMonitored, subscribeState } = this.state

    return (
      <div className="App">
        <div className="FixedTopBar">
          {topicMonitored !== null && (
            <p className="MonitoringState">
              We monitor {topicMonitored}<br />
              State: {subscribeState} <span className={cx('MonitoringState-dot', subscribeState === 'subscribed' && 'success')}></span>
            </p> )}

          <MonitorBar
            topicMonitored={topicMonitored}
            onMonitoredTopicChange={this.setTopicMonitored}
          />

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
