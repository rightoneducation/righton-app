import { generateClient } from "@aws-amplify/api";
import { onCreateMCPParsedResult } from '../graphql/subscriptions';
import { MCPParsedResult } from '../lib/Types';

export const client = generateClient({});

export function subscribeToResponse(
  responseId: string,
  callback: (result: MCPParsedResult) => void
) {
  console.log('Setting up subscription for responseId:', responseId);
  
  const result = client.graphql({
    query: onCreateMCPParsedResult,
    variables: {}
  });
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - GraphQL result type doesn't expose subscribe method
  return result.subscribe({
    next: ({ data }: { data: { onCreateMCPParsedResult: MCPParsedResult } }) => {
      console.log('Subscription received data:', data);
      if (data?.onCreateMCPParsedResult) {
        console.log('Calling callback with result:', data.onCreateMCPParsedResult);
        callback(data.onCreateMCPParsedResult);
      }
    },
    error: (error: Error) => {
      console.error('Subscription error:', error);
    },
  });
}