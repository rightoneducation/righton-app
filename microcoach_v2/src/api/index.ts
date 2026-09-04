// ── Auth / User layer (Cognito + Google OAuth) ──────────────────────────────
export { APIClients, AppType } from './APIClients/APIClients';
export { AuthAPIClient } from './APIClients/auth/AuthAPIClient';
export { UserAPIClient, userProfileLocalStorage } from './APIClients/user/UserAPIClient';
export { Environment } from './APIClients/interfaces/IBaseAPIClient';
export { UserRole, isAdmin } from './Models/IUser';
export type { IAuthAPIClient, GraphQLAuthMode } from './APIClients/auth/interfaces/IAuthAPIClient';
export type { IUserProfile, IClass } from './Models/IUser';
