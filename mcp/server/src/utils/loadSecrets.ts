import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function loadSecret(secretName: string) {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await client.send(command);
  if (!data.SecretString) throw new Error(`No SecretString found for ${secretName}`);
  return data.SecretString;
}