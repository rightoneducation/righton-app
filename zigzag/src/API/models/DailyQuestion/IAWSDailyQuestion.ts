// AWS Question structure - this gets serialized to JSON string in AWSDailyQuestion
export type AWSQuestion = {
  questionText: string;
  options: { key: string; answer: string; isAnswer: boolean }[];
  phaseOne: {
    correctAnswer: { answerKey: string; explanation: string };
    incorrectAnswerExplanation: string;
  };
  phaseTwo?: {
    correctAnswer: { answerKey: string; explanation: string };
    incorrectAnswerExplanation: string;
  };
};

// AWS Answer Analytics structure - this gets serialized to JSON string in AWSDailyQuestion
export type AWSAnswerAnalytics = {
  totalAnswers: number;
  leaderboards: { userId: string; points: number }[];
  phaseOne: {
    optionCounts: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
  };
  phaseTwo: {
    optionCounts: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
  };
  updatedAt: Date;
};

// AWS Comments structure - this gets serialized to JSON string in AWSDailyQuestion
export type AWSComments = {
  id: string;
  userId: string;
  comment: string;
  commentDate: Date;
}[];

// Main AWS DailyQuestion type - matches AWS GraphQL schema
export type AWSDailyQuestion = {
  id: string;
  createdAt?: string | null;
  topic?: string | null;
  imageUrl?: string | null;
  shareCount?: number | null;
  question?: string | null; // JSON string of AWSQuestion
  answerAnalytics?: string | null; // JSON string of AWSAnswerAnalytics
  comments?: string | null; // JSON string of AWSComments array
  updatedAt: string;
};