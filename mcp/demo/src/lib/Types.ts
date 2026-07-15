export type Student = {
  name: string;
  performance: 'excelling' | 'struggling';
  justification: string;
};

export type DiscussionQuestion = {
  studentName: string;
  question: string;
};

export type ToolCall = {
  name: string;
  args: Record<string, any>;
};

export type MCPParsedResult = {
  id: string;
  status: 'processing' | 'complete' | 'error';
  learningOutcomes?: string | null;
  students?: Student[] | null;
  discussionQuestions?: DiscussionQuestion[] | null;
  toolCalls?: ToolCall[] | null;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MCPParsedResultDisplay = {
  rightonTools: string[];
  learningCommonsTools: string[];
  learningOutcomes: string;
  students: Student[];
  discussionQuestions: DiscussionQuestion[];
  toolCalls: ToolCall[];
};

