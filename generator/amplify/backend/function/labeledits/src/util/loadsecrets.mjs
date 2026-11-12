import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const OPENAI_SECRET_NAME = "openai-api";
let cachedOpenAIKey;

export async function loadSecret(secretName) {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await client.send(command);
  if (!data.SecretString) throw new Error(`No SecretString found for ${secretName}`);
  return data.SecretString;
}

// Cached at module scope so a warm container reads the secret once.
export async function getOpenAIKey() {
  if (cachedOpenAIKey) return cachedOpenAIKey;
  const { openai_api } = JSON.parse(await loadSecret(OPENAI_SECRET_NAME));
  if (!openai_api) throw new Error(`Secret ${OPENAI_SECRET_NAME} must contain openai_api`);
  cachedOpenAIKey = openai_api;
  return cachedOpenAIKey;
}
