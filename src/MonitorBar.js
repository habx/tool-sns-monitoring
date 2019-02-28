// @flow

import React, { PureComponent } from 'react'
import memoizee from 'memoizee'
import { AWSEnvironment } from './lib/AWSEnvironment'
import { connect } from 'react-redux'
import EditIcon from '@material-ui/icons/Edit'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'

import { setTopicMonitored } from './actions'

class MonitorBar extends PureComponent {
  state = {
    fetchingTopics: false,
    listTopics: [],
    editing: true || !this.props.topicMonitored,
    inputText: '',
    inputFocused: false,
  }

  componentDidMount() {
    this.fetchTopics()
  }

  async fetchTopics(NextToken) {
    if (!this.state.fetchingTopics) {
      this.setState({ fetchingTopics: true })
    }

    const awsEnv = this.getAwsEnv()
    const res = await awsEnv.sns.listTopics({ NextToken }).promise()

    const newPartialState = {
      listTopics: this.state.listTopics.concat(res.Topics),
    }

    if (!res.NextToken) {
      newPartialState.fetchingTopics = false
    }

    this.setState(newPartialState)

    if (res.NextToken) {
      this.fetchTopics(res.NextToken)
    }
  }

  getSelectOptionsPure = memoizee((topics) => topics.map(({ TopicArn }) => {
    const topic = TopicArn.split(':').pop()

    return {
      value: topic,
      label: topic,
    }
  }))
  getSelectOptions = () => this.getSelectOptionsPure(this.state.listTopics)

  getAwsEnvPure = memoizee((awsCredentials) => new AWSEnvironment(awsCredentials))
  getAwsEnv = () => this.getAwsEnvPure(this.props.awsCredentials)

  onInputFocus = () => this.setState({ inputFocused: true })
  onInputBlur = () => this.setState({ inputFocused: false })
  onInputChange = (e) => this.setState({ inputText: e.target.value })
  onInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onMonitorButtonClick()
    }
  }

  onMonitorButtonClick = () => {
    this.props.setTopicMonitored(this.state.inputText)
    this.setDisplay()
  }

  setEditing = () => {
    this.setState({ editing: true, inputText: this.props.topicMonitored })
  }
  setDisplay = () => {
    this.setState({ editing: false })
  }
  setText = (text) => this.setState({ inputText: text })

  render() {
    const { editing, inputText, inputFocused, fetchingTopics } = this.state
    const { topicMonitored } = this.props

    let inner

    if (!editing) {
      inner = (
        <div className="MonitorBar-display">
          <div className="MonitorBar-display-left">
            <GraphicEqIcon className="MonitorBar-icon" />
            {topicMonitored}
          </div>
          <Button key="edit-btn" className="MonitorBar-action" onClick={this.setEditing}>
            <EditIcon style={{ marginRight: 8 }} />
            Change
          </Button>
        </div>
      )
    } else {
      const filteredTopics = this.getSelectOptions().filter(o => o.value.startsWith(inputText))

      inner = (
        <div className="MonitorBar-edit">
          <div className="MonitorBar-input-wrapper">
            <TextField
              autoFocus
              className="MonitorBar-input"
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChange={this.onInputChange}
              onKeyPress={this.onInputKeyPress}
              value={inputText}
              variant="outlined"
              placeholder="Type the name of a topic"
              InputProps={{
                style: { width: 400 },
                startAdornment: (
                  <InputAdornment position="start">
                    <GraphicEqIcon />
                  </InputAdornment>
                ),
              }}
            />

            {inputFocused && (
              <div className="MonitorBar-input-suggestions">
                {!fetchingTopics && filteredTopics.map(t => (
                  <div className="MonitorBar-input-suggestion" onClick={() => this.setText(t.value)}>
                    {t.label}
                  </div>
                ))}

                {!fetchingTopics && filteredTopics.length === 0 && (
                  <div className="MonitorBar-input-suggestion placeholder">
                    No existing topic with this name.
                  </div>
                )}

                {fetchingTopics && (
                  <div className="MonitorBar-input-suggestion placeholder">
                    Loading...
                  </div>
                )}
              </div>
            )}
          </div>

          <Button key="monitor-btn" className="MonitorBar-action" variant="outlined" color="primary" onClick={this.onMonitorButtonClick} disabled={inputText === ''}>
            Monitor {inputText}
            <GraphicEqIcon />
          </Button>
          <Button disabled={!topicMonitored} key="cancel-btn" className="MonitorBar-action" variant="outlined" onClick={this.setDisplay}>
            Cancel
          </Button>
        </div>
      )
    }


    return (
      <div className="MonitorBar">
        {inner}
      </div>
    )
  }
}

const mapStateToProps = ({ topicMonitored, awsCredentials }) => ({
  topicMonitored,
  awsCredentials,
})
const mapDispatchToProps = {
  setTopicMonitored,
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitorBar)
