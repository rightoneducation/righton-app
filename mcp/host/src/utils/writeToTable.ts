import fetch from 'node-fetch';

// Lazy load to ensure env vars are set before access
function getAppSyncEndpoint(): string {
  const endpoint = process.env.DYNAMO_DB_ENDPOINT;
  if (!endpoint) {
    throw new Error('DYNAMO_DB_ENDPOINT environment variable is not set');
  }
  return endpoint;
}

function getApiKey(): string {
  const apiKey = process.env.DYNAMO_DB_API;
  if (!apiKey) {
    throw new Error('DYNAMO_DB_API environment variable is not set');
  }
  return apiKey;
}

const createMCPParsedResultMutation = `
  mutation CreateMCPParsedResult($input: CreateMCPParsedResultInput!) {
    createMCPParsedResult(input: $input) {
      id
      status
      learningOutcomes
      students {
        name
        performance
        justification
      }
      discussionQuestions {
        studentName
        question
      }
      toolCalls {
        name
        args
      }
      error
      createdAt
      updatedAt
    }
  }
`;

interface Student {
  name: string;
  performance: 'excelling' | 'struggling';
  justification: string;
}

interface DiscussionQuestion {
  studentName: string;
  question: string;
}

interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

interface MCPResult {
  id: string;
  status: 'processing' | 'complete' | 'error';
  learningOutcomes?: string;
  students?: Student[];
  discussionQuestions?: DiscussionQuestion[];
  toolCalls?: ToolCall[];
  error?: string;
}

interface MCPParsedResultResponse {
  id: string;
  status: string;
  learningOutcomes: string | null;
  students: Student[] | null;
  discussionQuestions: DiscussionQuestion[] | null;
  toolCalls: ToolCall[] | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse {
  data?: {
    createMCPParsedResult: MCPParsedResultResponse;
  };
  errors?: GraphQLError[];
}

export async function writeMCPResultToTable(result: MCPResult): Promise<MCPParsedResultResponse> {
  try {
    const response = await fetch(getAppSyncEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getApiKey(),
      },
      body: JSON.stringify({
        query: createMCPParsedResultMutation,
        variables: {
          input: {
            id: result.id,
            status: result.status,
            learningOutcomes: result.learningOutcomes ?? null,
            students: result.students ?? null,
            discussionQuestions: result.discussionQuestions ?? null,
            toolCalls: result.toolCalls ?? null,
            error: result.error ?? null,
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as GraphQLResponse;
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`Failed to write to table: ${JSON.stringify(data.errors)}`);
    }
    
    if (!data.data?.createMCPParsedResult) {
      throw new Error('No data returned from mutation');
    }
    
    return data.data.createMCPParsedResult;
  } catch (error) {
    console.error('Error writing to DynamoDB via AppSync:', error);
    throw error;
  }
}

