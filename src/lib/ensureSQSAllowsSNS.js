
import uuidv4 from 'uuid/v4'

import wrapError from './wrapError'
import isEqualSharedKeys from './isEqualSharedKeys'

async function ensureSQSAllowsSNS(
  aws,
  QueueName,
  TopicNames,
  options = {},
) {
  const sqsArn = aws.getSQSArn(QueueName)
  const snsArns = TopicNames.map(name => aws.getSNSArn(name))
  const QueueUrl = aws.getSQSUrl(QueueName)

  const res = await aws.sqs.getQueueAttributes({
    QueueUrl,
    AttributeNames: ['Policy'],
  }).promise()

  let actualPolicy

  if (res.Attributes && res.Attributes.Policy) {
    actualPolicy = JSON.parse(res.Attributes.Policy)

    if (!actualPolicy.Statement) {
      actualPolicy.Statement = []
    }
  } else {
    actualPolicy = generateStartingPolicy(sqsArn)
  }

  const missingStatements = snsArns.reduce((arr, snsArn) => {
    const shouldHaveStatement = getPolicyStatementForAllowingSubscription(sqsArn, snsArn)
    const hasIt = actualPolicy.Statement.some(s => isEqualSharedKeys(shouldHaveStatement, s))

    if (!hasIt) {
      shouldHaveStatement.Sid = uuidv4()
      arr.push(shouldHaveStatement)
    }

    return arr
  }, [])

  if (missingStatements.length === 0) {
    return
  }

  if (options.createIfInexistant) {
    actualPolicy.Statement = actualPolicy.Statement.concat(missingStatements)
    await aws.sqs.setQueueAttributes({
      QueueUrl,
      Attributes: {
        Policy: JSON.stringify(actualPolicy),
      },
    }).promise()

    return
  }

  throw new Error(`Specified queue "${QueueName}" does not allow one of topics ${TopicNames.join(',')} to publish to it.
You can use option "createIfInexistant", to automatically update the policy to allow it.`)
}

export default wrapError(ensureSQSAllowsSNS, (_, QueueName, TopicNames) => `Error concerning authorizations between queue '${QueueName}' and topics ${TopicNames.join(',')}`)

/*
 * Matching policy for SQS and SNS
 */
export function getPolicyStatementForAllowingSubscription(sqsArn, snsArn) {
  const statement: PolicyStatement = {
    Effect: 'Allow',
    Principal: {
      AWS: '*',
    },
    Action: 'SQS:SendMessage',
    Resource: sqsArn,
    Condition: {
      ArnEquals: {
        'aws:SourceArn': snsArn,
      },
    },
  }

  return statement
}

/*
 * Generate a starting policy
 */
export function generateStartingPolicy(sqsArn) {
  return {
    Version: '2012-10-17',
    Id: `${sqsArn}/SQSPolicy`,
    Statement: [],
  }
}
