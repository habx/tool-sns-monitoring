
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SpaceBarIcon from '@material-ui/icons/SpaceBar'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import FlagIcon from '@material-ui/icons/Flag'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { setNamespace, setAwsCredentials } from './actions'

import './Settings.css'

class Settings extends PureComponent {
  state = {
    namespace: this.props.namespace || '',
    accountId: this.props.accountId || '',
    region: this.props.region || '',
    accessKeyId: this.props.accessKeyId || '',
    secretAccessKey: this.props.secretAccessKey || '',
  }

  onInputChange = (name) => (e) => this.setState({ [name]: e.target.value })
  saveSettings = () => {
    const { namespace, accountId, region, accessKeyId, secretAccessKey } = this.state

    this.props.setNamespace(namespace)
    this.props.setAwsCredentials({
      accountId,
      region,
      accessKeyId,
      secretAccessKey,
    })
    this.props.onClose()
  }

  render() {
    const {
      canClose,
    } = this.props

    const {
      namespace,
      accountId,
      region,
      accessKeyId,
      secretAccessKey,
    } = this.state

    const isModified = (
      namespace !== this.props.namespace
      || accountId !== this.props.accountId
      || region !== this.props.region
      || accessKeyId !== this.props.accessKeyId
      || secretAccessKey !== this.props.secretAccessKey
    )

    const isValid = (namespace && accountId && region && accessKeyId && secretAccessKey)

    return (
      <div className="Settings">
        {canClose && (
          <div className="Settings-nav">
            <Button onClick={this.props.onClose}>
              <CloseIcon />
              Close
            </Button>
          </div>
        )}

        <h1 className="Settings-title">Settings</h1>

        <TextField
          autoFocus
          className="Input Input-namespace"
          onChange={this.onInputChange('namespace')}
          value={namespace}
          variant="outlined"
          label="Namespace"
          placeholder="Enter your name, handle, dreams... :)"
          InputProps={{
            style: { width: 828, marginBottom: 14 },
            startAdornment: (
              <InputAdornment position="start">
                <SpaceBarIcon />
              </InputAdornment>
            ),
          }}
        />

        <div className="Settings-aws">
          <div className="Settings-aws-row">
            <TextField
              className="Input Input-namespace"
              onChange={this.onInputChange('accountId')}
              label="Account ID"
              value={accountId}
              variant="outlined"
              placeholder="724009402066"
              InputProps={{
                style: { width: 400, marginRight: 14, marginBottom: 14 },
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBoxIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className="Input Input-namespace"
              onChange={this.onInputChange('region')}
              value={region}
              label="Region"
              variant="outlined"
              placeholder="eu-west-1"
              InputProps={{
                style: { width: 400 },
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="Settings-aws-row">
            <TextField
              className="Input Input-namespace"
              onChange={this.onInputChange('accessKeyId')}
              value={accessKeyId}
              label="Access Key ID"
              variant="outlined"
              placeholder="AKIAJE2VZKVXXXXXXX"
              InputProps={{
                style: { width: 400, marginRight: 14, marginBottom: 14 },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className="Input Input-namespace"
              onChange={this.onInputChange('secretAccessKey')}
              value={secretAccessKey}
              label="Secret Access Key"
              variant="outlined"
              placeholder="GWdfsfeWDOKJXXXXXX"
              InputProps={{
                style: { width: 400 },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={this.saveSettings}
            disabled={!isModified || !isValid}
          >
            {isModified
              ? 'Save settings and close'
              : 'Not modified'}
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ namespace, awsCredentials }) => ({
  namespace,
  ...awsCredentials,
})

const mapDispatchToProps = {
  setNamespace,
  setAwsCredentials,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
