import { IAuthAPIClient } from '../auth/interfaces/IAuthAPIClient';
import { UserAPIClient } from '../user/UserAPIClient';
import { IUserProfile, UserRole } from '../../Models/IUser';

export const userProfileLocalStorage = 'microcoach_userprofile';

// Orchestrates Cognito auth + the MicroCoach `User` record + localStorage,
// adapted from central_v2's CentralDataManagerAPIClient for MicroCoach's own
// (imageless) User model.
export class MicroCoachDataManagerAPIClient {
  private auth: IAuthAPIClient;

  private user: UserAPIClient;

  constructor(authClient: IAuthAPIClient, userClient: UserAPIClient) {
    this.auth = authClient;
    this.user = userClient;
  }

  // ── localStorage (pure) ──────────────────────────────────────────────────
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

  // ── Resolve backend user from Cognito identity ───────────────────────────
  async getUser(cognitoId: string): Promise<IUserProfile | null> {
    const profile = await this.user.getUserByCognitoId(cognitoId);
    if (profile) this.setLocalUserProfile(profile);
    return profile;
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
    const profile = await this.user.getUserByCognitoId(cognitoId);
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
    const created = await this.user.createUser({
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
    const created = await this.user.createUser({
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
