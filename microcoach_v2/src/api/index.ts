// ── Auth / User layer (Cognito + Google OAuth) ──────────────────────────────
export { APIClients, AppType } from './APIClients/APIClients';
export { AuthAPIClient } from './APIClients/auth/AuthAPIClient';
export { UserAPIClient, userProfileLocalStorage } from './APIClients/user/UserAPIClient';
export { Environment } from './APIClients/interfaces/IAPIClients';
export { UserRole, isAdmin } from './Models/IUser';
export type { IAuthAPIClient, GraphQLAuthMode } from './APIClients/auth/interfaces/IAuthAPIClient';
export type { IUser, IClass } from './Models/IUser';
export type { IAPIClients } from './APIClients/interfaces/IAPIClients';
