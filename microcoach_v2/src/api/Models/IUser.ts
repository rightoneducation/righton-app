export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export interface IClass {
  id: string;
  name: string;
}

export interface IUser {
  id?: string;
  cognitoId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Derived from the email domain at sign-up (lib/schools); null when the
  // domain names no school or the row predates the field.
  school?: string | null;
  classes?: string[];
  role?: UserRole | null;
  createdAt?: string;
  updatedAt?: string;
  // transient — only used by signup forms/orchestration, never persisted to the User table
  password?: string;
}

export const isAdmin = (profile?: IUser | null): boolean =>
  profile?.role === UserRole.ADMIN;
