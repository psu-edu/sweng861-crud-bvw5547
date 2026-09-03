const { DynamoDBClient, DescribeTableCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const tableName = process.env.DYNAMODB_TABLE || 'SWENG861Users';
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const database = DynamoDBDocumentClient.from(client);

async function initializeDatabase() {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
  } catch (error) {
    if (error.name !== 'ResourceNotFoundException') throw error;
    await client.send(new CreateTableCommand({
      TableName: tableName,
      KeySchema: [{ AttributeName: 'providerId', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'providerId', AttributeType: 'S' }],
      BillingMode: 'PAY_PER_REQUEST'
    }));
    console.log(`Created DynamoDB table ${tableName}`);
  }
}

async function upsertUser(profile) {
  const now = new Date().toISOString();
  const existingUser = await findUserById(profile.id);
  const user = {
    id: existingUser?.id || `user-${profile.id}`,
    providerId: profile.id,
    email: profile.emails?.[0]?.value || null,
    name: profile.displayName || null,
    createdAt: existingUser?.createdAt || now,
    updatedAt: now
  };

  await database.send(new PutCommand({ TableName: tableName, Item: user }));
  return user;
}

async function findUserById(providerId) {
  const result = await database.send(new GetCommand({
    TableName: tableName,
    Key: { providerId }
  }));
  return result.Item || false;
}

module.exports = { initializeDatabase, upsertUser, findUserById };