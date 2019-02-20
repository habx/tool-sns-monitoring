
import { SQS, SNS, CloudWatch } from 'aws-sdk'

import omit from 'lodash.omit'

class AWSEnvironment {
  config = {
    accountId: process.env.AWS_ACCOUNT_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    getAWSSDKOptions: () => ({}),
    getQueueUrl: null,
  }

  constructor(config = {}) {
    this.config = { ...this.config, ...config }

    const credentials = omit(this.config, ['accountId', 'getAWSSDKOptions', 'getQueueUrl'])
    const sqsOptions = this.sqsOptions = { ...credentials, ...this.config.getAWSSDKOptions('sqs') }
    const snsOptions = this.snsOptions = { ...credentials, ...this.config.getAWSSDKOptions('sns') }
    const cloudwatchOptions = this.cloudwatchOptions = { ...credentials, ...this.config.getAWSSDKOptions('cloudwatch') }

    this.sqs = new SQS(sqsOptions)
    this.sns = new SNS(snsOptions)
    this.cloudwatch = new CloudWatch(cloudwatchOptions)
  }

  getArn(serviceName, name) {
    return `arn:aws:${serviceName}:${this.config.region}:${this.config.accountId}:${name}`
  }

  getName(arn) {
    return arn.split(':').pop()
  }

  getSQSArn(queueName) {
    return this.getArn('sqs', queueName)
  }

  getSQSUrl(queueName) {
    if (this.config.getQueueUrl) {
      return this.config.getQueueUrl(queueName)
    }

    return `https://sqs.${this.config.region}.amazonaws.com/${this.config.accountId}/${queueName}`
  }

  getSNSArn(topicName) {
    return this.getArn('sns', topicName)
  }
}

export { AWSEnvironment }
