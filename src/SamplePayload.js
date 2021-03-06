
import React, { PureComponent } from 'react'
import copy from 'copy-to-clipboard'
import { withSnackbar } from 'notistack'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'

import './SamplePayload.css'

type Props = {
  name: string,
  enqueueSnackbar: (string, Object) => void,
};
type State = typeof undefined;

export default withSnackbar(class SamplePayload extends PureComponent<Props, State> {
  editAndReplay = () => {
    this.props.editAndReplayMessage(this.props.data)
  }

  copy = () => {
    copy(JSON.stringify(this.props.data))
    this.props.enqueueSnackbar('Copied to clipboard!', { variant: 'success' })
  }

  render() {
    const {
      name,
    } = this.props

    return (
      <div className="TypicalPayload">
        <div className="TypicalPayload-actions">
          <IconButton className="TypicalPayload-action" onClick={this.editAndReplay}>
            <EditIcon style={{ width: 16, height: 16 }} />
          </IconButton>
          <IconButton className="TypicalPayload-action" onClick={this.copy}>
            <FileCopyIcon style={{ width: 16, height: 16 }} />
          </IconButton>
        </div>

        <p className="TypicalPayload-title">
          {name}
        </p>
      </div>
    )
  }
})
