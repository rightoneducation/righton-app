// MicroCoach v2 User model (mirrors the `User` @model in the amplify schema).
// `isAdmin` is derived in-app from `role` (DynamoDB GSI keys can't be Boolean),
// so `role` is the single source of truth with the `byRole` GSI.

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

// Embedded (non-@model) class object stored as a list on the User item.
export interface IClass {
  id: string;
  name: string;
}

export interface IUserProfile {
  id?: string;
  cognitoId?: string;
  email: string;
  teacherName?: string;
  classes?: IClass[];
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  // transient — only used by signup forms/orchestration, never persisted to the User table
  password?: string;
}

// Convenience derivation used across the app instead of a stored boolean.
export const isAdmin = (profile?: IUserProfile | null): boolean =>
  profile?.role === UserRole.ADMIN;
