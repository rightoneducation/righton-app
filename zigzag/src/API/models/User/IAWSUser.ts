export interface IAWSUser {
  id: string;
  email: string;
  userName?: string | null;
  password?: string | null;
  points?: number | null;
  currentStreak?: number | null;
  maxStreak?: number | null;
  globalRank?: number | null;
  topSubjects?: string[] | null;
  accuracy?: number | null;
  hasAnsweredToday?: boolean | null;
  lastAnsweredDate?: string | null; // AWSDateTime
  sessions?: string | null; // AWSJSON
  createdAt?: string | null; // AWSDateTime
  updatedAt?: string | null; // AWSDateTime
  __typename?: string;
}
