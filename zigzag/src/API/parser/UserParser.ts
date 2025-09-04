import { IUser } from "../models/User/IUser";
import { IAWSUser } from "../models/User/IAWSUser";

// Helper function for null/undefined checks
function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export class UserParser {
  static userFromAWSUser(awsUser: IAWSUser): IUser {
    if (isNullOrUndefined(awsUser)) {
      throw new Error("User is null");
    }

    if (isNullOrUndefined(awsUser.id) || isNullOrUndefined(awsUser.email)) {
      throw new Error("User has null field for required attributes");
    }

    let parsedSessions: any = null;
    
    // Parse sessions JSON if it exists
    if (!isNullOrUndefined(awsUser.sessions)) {
      try {
        parsedSessions = JSON.parse(awsUser.sessions!);
      } catch (error) {
        console.warn('Failed to parse sessions as JSON:', error);
        parsedSessions = null;
      }
    }

    const user: IUser = {
      id: awsUser.id,
      email: awsUser.email,
      userName: awsUser.userName || undefined,
      password: awsUser.password || undefined,
      points: awsUser.points || 0,
      currentStreak: awsUser.currentStreak || 0,
      maxStreak: awsUser.maxStreak || 0,
      globalRank: awsUser.globalRank || undefined,
      topSubjects: awsUser.topSubjects || [],
      accuracy: awsUser.accuracy || 0.0,
      hasAnsweredToday: awsUser.hasAnsweredToday || false,
      lastAnsweredDate: awsUser.lastAnsweredDate ? new Date(awsUser.lastAnsweredDate) : undefined,
      sessions: parsedSessions,
      createdAt: awsUser.createdAt ? new Date(awsUser.createdAt) : new Date(),
      updatedAt: awsUser.updatedAt ? new Date(awsUser.updatedAt) : new Date()
    };

    return user;
  }
}
