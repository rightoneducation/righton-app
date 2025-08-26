/**1. USER**/
interface User {
  _id?: string;
  email: string;
  username: string;
  passwordHash: string;
  points: number;
  currentStreak: number;
  maxStreak: number;
  globalRank: number;
  topSubjects: string[];
  accuracy: number;
  hasAnsweredToday: boolean; // <-- email reminders?
  lastAnsweredDate: Date;
  sessions: QOTDSession[];
  createdAt: Date;
  updatedAt: Date;
}

// apart of user's unique session for QOTD
type QOTDSession = {
  qotdId: string;
  startedAt: Date;
  pointsEarned: number;
  questionText: string;
  phaseOne: {
    answer: { selectedAnswer: string; isCorrect: boolean };
    completed: boolean;
    pointsEarned: number;
    completedAt: Date;
  };
  phaseTwo: {
    answer: { selectedAnswer: string; isCorrect: boolean };
    completed: boolean;
    pointsEarned: number;
    completedAt: Date;
  };
}