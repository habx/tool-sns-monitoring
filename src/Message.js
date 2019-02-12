
import ColorHash from 'color-hash'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import cx from 'classnames'
import React, { PureComponent } from 'react'
import { withSnackbar } from 'notistack'
// import Icon from '@material-ui/core/Icon'
import FullStarIcon from '@material-ui/icons/Star'
import EmptyStarIcon from '@material-ui/icons/StarBorder'
import FileCopy from '@material-ui/icons/FileCopy'
import Edit from '@material-ui/icons/Edit'
import Replay from '@material-ui/icons/Replay'
// import classnames from 'classnames/bind'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import JSONFormatter from 'json-formatter-js'
import omit from 'lodash.omit'
import memoizee from 'memoizee'
import copy from 'copy-to-clipboard'

import './Message.css'
// import classes from './Message.scss'

const colorHash = new ColorHash()
dayjs.extend(relativeTime)
// const cx = classnames.bind(classes)

const memoizeedTryJSONMessage = memoizee((stringMsg) => {
  try {
    return JSON.parse(stringMsg)
  } catch (e) {}

  return stringMsg
})

class Message extends PureComponent {

  onEditAndReplayButtonClick = () => {
    this.props.openEditAndReplayModal(
      memoizeedTryJSONMessage(this.props.data.Message)
    )
  }

  onReplayButtonClick = () => {
    this.props.replayMessage(
      memoizeedTryJSONMessage(this.props.data.Message)
    )
  }

  onCopyButtonClick = () => {
    copy(this.props.data.Message)
    this.props.enqueueSnackbar('Copied to clipboard!', { variant: 'success' })
  }

  toggleFav = () => {
    const fn = this.props.isFavorite
      ? this.props.unfavMessage
      : this.props.favMessage
    fn(this.props.data)
  }

  relativeTimeRef = (el) => {
    if (el) {
      el.innerHTML = dayjs(this.props.data.Timestamp).fromNow()
      this.relativeTimeTimeout = setTimeout(() => this.relativeTimeRef(el), 5000)
    } else {
      clearTimeout(this.relativeTimeTimeout)
    }
  }

  render() {
    const {
      data,
      isNew,
      isFavorite,
      compressedView,
    } = this.props

    const rgb = colorHash.rgb(data.MessageId)
    const style = {
      backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, .2)`,
    }

    let Message = memoizeedTryJSONMessage(data.Message)
    const MessageDayJS = dayjs(data.Timestamp)
    const isSameDay = MessageDayJS.isSame(dayjs(), 'day')

    const jsonMetadataView = new JSONFormatter(omit(data, ['Message']), 0)
    const jsonView = new JSONFormatter(Message, 2)

    const ButtonComponent = !compressedView ? Button : IconButton
    const StarIcon = isFavorite ? FullStarIcon : EmptyStarIcon

    return (
      <div className="Message-outer">
        {isNew && (
          <div className="Message-new-marker">
            <p className="Message-new-marker-inside">
              NEW! - <span ref={this.relativeTimeRef}></span>
            </p>
          </div>
        )}
        <div className="Message" style={style}>
          <StarIcon
            className="Message-staricon"
            onClick={this.toggleFav}
          />

          {isSameDay && (
            <p className="Message-relative-date" ref={this.relativeTimeRef}></p>
          )}
          <p className="Message-date">{MessageDayJS.format('DD MMMM à HH:mm')}</p>
          <p className="Message-id">{data.MessageId}</p>

          <div className={cx('Message-actions', compressedView && 'compressed')}>
            <ButtonComponent className="Message-action" variant="contained" onClick={this.onEditAndReplayButtonClick}>
              <Edit />{!compressedView && ' Edit and Replay'}
            </ButtonComponent>
            <ButtonComponent className="Message-action" variant="contained" onClick={this.onReplayButtonClick}>
              <Replay />{!compressedView && ' Replay'}
            </ButtonComponent>
            <ButtonComponent className="Message-action" variant="contained" onClick={this.onCopyButtonClick}>
              <FileCopy />{!compressedView && ' Copy'}
            </ButtonComponent>
          </div>
          <div
            key="metadata"
            className="Message-metadata-json"
            ref={el => {
              if (el && !el.innerHTML) {
                el.appendChild(jsonMetadataView.render())
              }
            }}
          >
          </div>
          <div
            key="json"
            className="Message-json"
            ref={el => {
              if (el && !el.innerHTML) {
                el.appendChild(jsonView.render())
              }
            }}
          >
          </div>
        </div>
      </div>
    )
  }
}

export default withSnackbar(Message)
