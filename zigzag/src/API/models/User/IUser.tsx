export interface IUser {
  id: string;
  email: string;
  userName?: string;
  password?: string;
  points: number;
  currentStreak: number;
  maxStreak: number;
  globalRank?: number;
  topSubjects: string[];
  accuracy: number;
  hasAnsweredToday: boolean;
  lastAnsweredDate?: Date;
  sessions?: any; // Parsed JSON data
  createdAt: Date;
  updatedAt: Date;
}
