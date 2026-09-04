import { generateClient } from 'aws-amplify/api';
import { IAuthAPIClient } from '../auth/interfaces/IAuthAPIClient';
import { IUserProfile, UserRole } from '../../Models/IUser';
import { createUser, updateUser } from '../../../graphql/mutations';
import {
  getUser,
  usersByCognitoId,
  usersByEmail,
  usersByRole,
} from '../../../graphql/queries';

export const userProfileLocalStorage = 'microcoach_userprofile';

// CRUD + GSI queries for the `User` model, plus the Cognito auth flows that
// resolve into it (login / signup / signout) and the localStorage profile cache.
// Calls are userPool-authed (the User model uses Cognito owner/group auth).
// Loose `any` typing matches the existing ported APIClient style in this package.
export class UserAPIClient {
  private client: any;

  private auth: IAuthAPIClient;

  constructor(authClient: IAuthAPIClient) {
    this.client = generateClient({});
    this.auth = authClient;
  }

  private async call<T = any>(query: any, variables?: Record<string, unknown>): Promise<T> {
    return this.client.graphql({ query, variables, authMode: 'userPool' });
  }

  // ── User model CRUD ────────────────────────────────────────────────────────

  async createUser(input: Partial<IUserProfile>): Promise<IUserProfile> {
    const res = await this.call(createUser, { input });
    return res.data?.createUser;
  }

  async updateUser(input: Partial<IUserProfile> & { id: string }): Promise<IUserProfile> {
    const res = await this.call(updateUser, { input });
    return res.data?.updateUser;
  }

  async getUser(id: string): Promise<IUserProfile | null> {
    const res = await this.call(getUser, { id });
    return res.data?.getUser ?? null;
  }

  // Resolves the backend User row from a Cognito identity — the lookup every
  // auth flow funnels through. Pure: callers decide whether to cache the hit.
  async getUserByCognitoId(cognitoId: string): Promise<IUserProfile | null> {
    const res = await this.call(usersByCognitoId, { cognitoId });
    return res.data?.usersByCognitoId?.items?.[0] ?? null;
  }

  async getUserByEmail(email: string): Promise<IUserProfile | null> {
    const res = await this.call(usersByEmail, { email });
    return res.data?.usersByEmail?.items?.[0] ?? null;
  }

  // Admin listing — "all admins" or "all members" via the byRole GSI.
  async listUsersByRole(role: UserRole): Promise<IUserProfile[]> {
    const res = await this.call(usersByRole, { role });
    return res.data?.usersByRole?.items ?? [];
  }

  // ── localStorage profile copy ────────────────────────────────────────────
  // Written whenever a profile becomes the signed-in user (login / signup / the
  // on-load resolver). Nothing reads it back yet — `getLocalUserProfile` is the
  // deliberate seam for repopulating app state later, so don't prune it as dead
  // code. Intentionally no refresh-on-read: that would cost an extra round trip.
  getLocalUserProfile(): IUserProfile | null {
    const raw = localStorage.getItem(userProfileLocalStorage);
    return raw ? (JSON.parse(raw) as IUserProfile) : null;
  }

  setLocalUserProfile(profile: IUserProfile): void {
    localStorage.setItem(userProfileLocalStorage, JSON.stringify(profile));
  }

  clearLocalUserProfile(): void {
    localStorage.removeItem(userProfileLocalStorage);
  }

  // ── Email / password login ───────────────────────────────────────────────
  async loginAndRetrieveUserProfile(
    email: string,
    password: string,
  ): Promise<IUserProfile | null> {
    await this.auth.awsSignIn(email, password);
    const session = await this.auth.getCurrentSession();
    const cognitoId = session.userSub;
    if (!cognitoId) return null;
    const profile = await this.getUserByCognitoId(cognitoId);
    if (profile) {
      this.setLocalUserProfile(profile);
      this.auth.isUserAuth = true;
    }
    return profile;
  }

  // ── Sign up (step 1: send confirmation code) ─────────────────────────────
  async signUpSendConfirmationCode(profile: IUserProfile): Promise<void> {
    await this.auth.awsSignUp(profile.email, profile.email, profile.password ?? '');
  }

  // ── Sign up (step 2: confirm code, sign in, create backend User row) ─────
  async signUpConfirmAndBuildBackendUser(
    profile: IUserProfile,
    confirmationCode: string,
  ): Promise<IUserProfile> {
    await this.auth.awsConfirmSignUp(profile.email, confirmationCode);
    await this.auth.awsSignIn(profile.email, profile.password ?? '');
    const session = await this.auth.getCurrentSession();
    const cognitoId = session.userSub ?? '';
    const created = await this.createUser({
      cognitoId,
      email: profile.email,
      teacherName: profile.teacherName,
      role: UserRole.MEMBER,
      classes: profile.classes ?? [],
    });
    this.setLocalUserProfile(created);
    this.auth.isUserAuth = true;
    return created;
  }

  // ── Google sign up (post-federation: build the backend User row) ─────────
  async signUpGoogleBuildBackendUser(profile: IUserProfile): Promise<IUserProfile> {
    const session = await this.auth.getCurrentSession();
    const cognitoId = session.userSub ?? '';
    const email = (await this.auth.getUserEmail()) ?? profile.email;
    const created = await this.createUser({
      cognitoId,
      email,
      teacherName: profile.teacherName,
      role: UserRole.MEMBER,
      classes: profile.classes ?? [],
    });
    this.setLocalUserProfile(created);
    this.auth.isUserAuth = true;
    return created;
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  async signOut(): Promise<void> {
    await this.auth.awsSignOut();
    this.auth.isUserAuth = false;
    this.clearLocalUserProfile();
  }
}
