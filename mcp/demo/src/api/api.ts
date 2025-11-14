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
    variables: {}
  });
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - GraphQL result type doesn't expose subscribe method
  return result.subscribe({
    next: ({ data }: { data: { onCreateMCPParsedResult: MCPParsedResult } }) => {
      if (data?.onCreateMCPParsedResult) {
        callback(data.onCreateMCPParsedResult);
      }
    },
    error: (error: Error) => {
      console.error('Subscription error:', error);
    },
  });
}