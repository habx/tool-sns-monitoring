
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import memoizee from 'memoizee'
import { AWSEnvironment } from '@habx/lib-mq-aws/dist/src/AWSEnvironment'
import ensureSQSAllowsSNS from '@habx/lib-mq-aws/dist/src/lib/ensureSQSAllowsSNS'
import { withSnackbar } from 'notistack'
import JSONEditor from 'jsoneditor'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import getSamplePayloads from './drivers/getSamplePayloads'

import 'jsoneditor/dist/jsoneditor.min.css'
import './TopicMonitor.css'
import Message from './Message'
import SamplePayload from './SamplePayload'

// const accountId = '724009402066'
// const region = 'eu-west-1'
// const accessKeyId = 'AKIAJE2VZKV4ZFQFSXYA'
// const secretAccessKey = 'GdpG7quOT344IKl+fZSWV6MgT3MmJYPCFMG1HzBc'
// const awsEnv = new AWSEnvironment({
//   accountId,
//   region,
//   accessKeyId,
//   secretAccessKey,
// })

// aws.config.update({
//   region,
//   accessKeyId,
//   secretAccessKey,
// })

// const SQS = new aws.SQS()
// const SNS = new aws.SNS()

const unserializeMessagesForTopic = (topicName) => {
  const messagesStored = window.localStorage.getItem(topicName + '/messages')
  return (messagesStored
    ? JSON.parse(messagesStored)
    : [])
}

const serializeFavoritesForTopic = (topicName, favorites) => {
  window.localStorage.setItem(topicName + '/favorites', JSON.stringify(favorites))
}

const unserializeFavoritesForTopic = (topicName) => {
  const favorites = window.localStorage.getItem(topicName + '/favorites')
  return (favorites
    ? JSON.parse(favorites)
    : [])
}

const serializeMessagesForTopic = (topicName, messages) => {
  window.localStorage.setItem(topicName + '/messages', JSON.stringify(messages))
}

class TopicMonitor extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      samplePayloads: null,
      editAndReplayMessage: null,
      historyMessages: unserializeMessagesForTopic(this.props.topic),
      currentMessages: [],
      newMessages: [],
      favoriteMessages: unserializeFavoritesForTopic(this.props.topic),
    }
  }
  
  getAwsEnvPure = memoizee((awsCredentials) => new AWSEnvironment(awsCredentials))
  getAwsEnv = () => this.getAwsEnvPure(this.props.awsCredentials)

  componentDidMount() {
    const awsEnv = this.getAwsEnv()

    window.addEventListener('blur', this.onWindowBlur)
    window.addEventListener('beforeunload', this.onWindowUnload)
    this.fetchSamplePayloads()
    return (async () => {
      this.changeSubscribeState('preparing')
      const QueueName = this.getQueueName()
      const { QueueUrl } = await awsEnv.sqs.createQueue({
        QueueName,
      }).promise()
      this.createdQueueUrl = QueueUrl

      await ensureSQSAllowsSNS(awsEnv, QueueName, [this.props.topic], {createIfInexistant: true}) //

      await awsEnv.sns.subscribe({
        Protocol: 'sqs',
        TopicArn: awsEnv.getArn('sns', this.props.topic),
        Endpoint: awsEnv.getArn('sqs', QueueName),
      }).promise()

      this.poll()

      this.changeSubscribeState('subscribed')

    })().catch(err => {
        this.props.enqueueSnackbar('Erreur lors de la souscription au topic : ' + err.message, { variant: 'error', autoHideDuration: undefined })
      })
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.onWindowBlur)
    this.cleanup()
  }

  changeSubscribeState = newState => {
    this.setState({ subscribeState: newState })
    this.props.onSubscribeStateChange(newState)
  }

  cleanup() {
    const awsEnv = this.getAwsEnv()

    if (!this.createdQueueUrl) {
      return Promise.resolve()
    }

    return awsEnv.sqs.deleteQueue({
      QueueUrl: this.createdQueueUrl,
    }).promise()
      .catch(console.error)
  }

  fetchSamplePayloads() {
    getSamplePayloads(this.props.topic)
      .then(payloads => this.setState({ samplePayloads: payloads }))
      .catch(console.error)
  }

  onWindowBlur = () => {
    if (this.state.newMessages.length > 0) {
      this.setState({
        newMessages: [],
        currentMessages: [...this.state.newMessages, ...this.state.currentMessages],
      })
    }
  }

  getQueueName = () => `local-monitor-${this.props.namespace}-${this.props.topic}`
  getQueueUrl = () => {
    const awsEnv = this.getAwsEnv()
    return awsEnv.getSQSUrl(this.getQueueName())
  }

  poll = async () => {
    try {
      const awsEnv = this.getAwsEnv()
      const QueueUrl = this.getQueueUrl()
      const { Messages } = await awsEnv.sqs.receiveMessage({
        QueueUrl,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 20,
      }).promise()

      Messages.forEach(async (message) => {
        try {
          await this.handleMessage(JSON.parse(message.Body))
          await awsEnv.sqs.deleteMessage({
            QueueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }).promise()
        } catch (e) {
          console.log('Error while trying to handle incoming message.')
          console.error(e)
          await awsEnv.sqs.changeMessageVisibility({
            QueueUrl,
            ReceiptHandle: message.ReceiptHandle,
            VisibilityTimeout: 10,
          }).promise()
        }
      })
    } catch (e) {
      this.props.enqueueSnackbar('Error while polling messages:' + e.message, { variant: 'error' })
      console.error(e)
    }

    this.poll()
  }

  addFavorite = (message) => {
    const n = this.state.favoriteMessages.slice()
    n.push(message)
    this.setState({ favoriteMessages: n }, () => {
      serializeFavoritesForTopic(this.props.topic, n)
    })
  }

  removeFavorite = (message) => {
    console.log('remove', message)
    const n = this.state.favoriteMessages.filter(m => m.MessageId !== message.MessageId)
    this.setState({ favoriteMessages: n }, () => {
      serializeFavoritesForTopic(this.props.topic, n)
    })
  }

  handleMessage = async (message) => {
    const key = window.isWindowFocused
      ? 'currentMessages'
      : 'newMessages'
    const newList = this.state[key].slice()
    newList.unshift(message)

    this.setState({ [key]: newList }, () => {
      serializeMessagesForTopic(this.props.topic, [
        ...this.state.newMessages,
        ...this.state.currentMessages,
        ...this.state.historyMessages,
      ])
    })
  }

  handleEditModalClose = () => {
    this.setState({
      editAndReplayMessage: null,
    })
  }

  openEditAndReplayModal = (withMessage) => {
    this.setState({
      editAndReplayMessage: withMessage,
    })
  }

  replayMessage = async (Message) => {
    const awsEnv = this.getAwsEnv()
    await awsEnv.sns.publish({
      Message,
      TopicArn: awsEnv.getSNSArn(this.props.topic),
    }).promise()
    this.props.enqueueSnackbar('Message replayed!', { variant: 'success' })
  }

  renderSamplePayload = (sample) => {
    return (
      <SamplePayload
        {...sample}
        editAndReplayMessage={this.openEditAndReplayModal}
      />
    )
  }


  newMessageProps = { isNew: true }
  renderNewMessage = (message) => {
    return this.renderMessage(message, this.newMessageProps)
  }

  renderFavoriteMessage = (message) => {
    return this.renderMessage(message, { compressedView: true })
  }

  renderMessage = (message, additionalProps) => {
    const isFavorite = this.state.favoriteMessages.some(m => m.MessageId === message.MessageId)
    return (
      <Message
        key={message.MessageId}
        isFavorite={isFavorite}
        openEditAndReplayModal={this.openEditAndReplayModal}
        replayMessage={this.replayMessage}
        favMessage={this.addFavorite}
        unfavMessage={this.removeFavorite}
        data={message}
        {...additionalProps}
      />
    )
  }

  render() {
    const { newMessages, currentMessages, historyMessages, editAndReplayMessage, favoriteMessages, samplePayloads, subscribeState } = this.state

    if (subscribeState !== 'subscribed') {
      return null
    }

    return (
      <div>
        <div className="LeftColumn">
          <h3>Typical Payloads</h3>

          {!samplePayloads && (
            <CircularProgress />
          )}

          {samplePayloads && samplePayloads.map(this.renderSamplePayload)}
          {samplePayloads && samplePayloads.length === 0 && (
            <p>No sample payloads.</p>
          )}

          <h3>Favorite payloads</h3>

          {favoriteMessages.map(this.renderFavoriteMessage)}
        </div>
        <div className="RightColumn">
          <h3>Current Session</h3>
          <div className="Messages">
            {newMessages.map(this.renderNewMessage)}
            {currentMessages.map(this.renderMessage)}
          </div>

          <h3>History</h3>
          
          <div className="Messages">
            {historyMessages.map(this.renderMessage)}
          </div>

          {editAndReplayMessage && (
            <EditReplayModal
              open={true}
              message={editAndReplayMessage}
              replayMessage={this.replayMessage}
              closeModal={this.handleEditModalClose}
            />
          )}

        </div>
      </div>
    )
  }
}

TopicMonitor = withSnackbar(TopicMonitor)
const mapStateToProps = ({ namespace, awsCredentials }) => ({
  namespace,
  awsCredentials,
})

export default connect(mapStateToProps)(TopicMonitor)

class EditReplayModal extends PureComponent {
  state = {
    replaying: false,
  }

  jsonEditorDivRef = (el) => {
    this.editorNode = el

    if (el) {
      this.editorInstance = new JSONEditor(el, {}, this.props.message)
    } else {
      this.editorInstance.destroy()
    }
  }

  replayMessage = () => {
    const editorData = this.editorInstance.get()
    const stringMsg = typeof editorData === 'object'
      ? JSON.stringify(editorData)
      : "" + editorData

    this.setState({ replaying: true })
    this.props.replayMessage(stringMsg)
      .then(() => {
        this.setState({ replaying: false })
        this.props.closeModal()
      })
  }

  render() {
    const { replaying } = this.state

    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={this.props.open}
        onClose={this.props.closeModal}
      >
        <DialogTitle>Edit and replay message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit the content of the message and eventually replay it
          </DialogContentText>
          <div ref={this.jsonEditorDivRef}>
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={replaying} onClick={this.props.closeModal} color="primary">
            Cancel
          </Button>
          <Button disabled={replaying} onClick={this.replayMessage} color="primary">
            {replaying
              ? <Fragment><CircularProgress size={20} style={{ marginRight: 8 }} /> Replaying...</Fragment>
              : 'Replay'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
