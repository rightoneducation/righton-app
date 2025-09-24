export interface IDailyQuestion {
 _id?: string;
  createdAt: Date;
  topic: string;
  question: {
    questionText: string;
    options: { key: string; answer: string; isAnswer?: boolean }[];
    phaseOne: {
      correctAnswer: { answerKey: string; explanation: string };
      incorrectAnswerExplanation: string;
    };
    phaseTwo?: {
      correctAnswer: { answerKey: string; explanation: string };
      incorrectAnswerExplanation: string;
    };
  };
  imageUrl?: string;
  answerAnalytics?: {
    totalAnswers: number; // <-- should this be tracked separately (below)?
   // questionText: string;
    leaderboards: { userId: string; points: number }[];
    phaseOne: {
      // total answers: number ? <---
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
  comments: {
    id: string; // <-- unless apart of QOTD documents
    userId: string;
    comment: string;
    commentDate: Date;
  };
  shareCount?: number;
}