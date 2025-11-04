import { generateClient } from "@aws-amplify/api";
import { onCreateMCPParsedResult } from '../graphql/subscriptions';
import { MCPParsedResult } from '../lib/Types';

export const client = generateClient({});

export function subscribeToResponse(
  responseId: string,
  callback: (result: MCPParsedResult) => void
) {
  const result = client.graphql({
    query: onCreateMCPParsedResult,
    variables: {
      filter: {
        id: { eq: responseId }
      }
    }
  });
  
  //@ts-ignore
  return result.subscribe({
    next: ({ data }: any) => {
      if (data?.onCreateMCPParsedResult) {
        callback(data.onCreateMCPParsedResult);
      }
    },
    error: (error: any) => console.error('Subscription error:', error),
  });
}