import AWS from 'aws-sdk'
const REGION = process.env.AWS_REGION || 'us-east-1'
const USER_TABLE = process.env.USER_TABLE_NAME
const EMAIL_INDEX = process.env.EMAIL_INDEX_NAME
AWS.config.update({ region: REGION })
const dynamo = new AWS.DynamoDB.DocumentClient()

export const handler = async event => {
  const { email, pass } = event.arguments.input || {}
  if (!email || !pass) throw new Error('Missing input fields.')

  const { Items } = await dynamo.query({
    TableName: USER_TABLE,
    IndexName: EMAIL_INDEX,
    KeyConditionExpression: '#e = :e',
    ExpressionAttributeNames: { '#e': 'email' },
    ExpressionAttributeValues: { ':e': email },
    Limit: 1
  }).promise()
  const user = Items[0]
  if (!user) throw new Error('EMAIL_NOT_FOUND')

  const now = new Date().toISOString()
  await dynamo.update({
    TableName: USER_TABLE,
    Key: { id: user.id },
    UpdateExpression: 'SET #p = :p, updatedAt = :u',
    ExpressionAttributeNames: { '#p': 'password' },
    ExpressionAttributeValues: { ':p': pass, ':u': now }
  }).promise()

  return 'Password updated successfully'
}
