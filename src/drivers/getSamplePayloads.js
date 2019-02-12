
const removeEnvFromTopicName = (topicName) => topicName.replace(/^(local|dev|staging|prod|release)-/, '')

const ROOT_URL = 'https://habx.github.io/res-sqs-sample-payloads/payloads/'
export default async (topicName) => {
  const topicNameWithoutEnv = removeEnvFromTopicName(topicName)

  const res = await fetch(ROOT_URL + topicNameWithoutEnv + '.json')
  if (res.status < 200 || res.status >= 300) {
    return []
  }

  const json = await res.json()
  return json
}