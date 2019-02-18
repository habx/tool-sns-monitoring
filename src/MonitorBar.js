
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import EditIcon from '@material-ui/icons/Edit'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'

import { setTopicMonitored } from './actions'

class MonitorBar extends PureComponent {
  state = {
    editing: !this.props.topicMonitored,
    inputText: '',
  }

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

  render() {
    const { editing, inputText } = this.state
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
      inner = (
        <div className="MonitorBar-edit">
          <TextField
            autoFocus
            className="MonitorBar-input"
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

const mapStateToProps = ({ topicMonitored }) => ({
  topicMonitored,
})
const mapDispatchToProps = {
  setTopicMonitored,
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitorBar)
