import { BaseAPIClient, GraphQLOptions } from '../base/BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';
import { IUser, UserRole } from '../../Models/IUser';
import { UserParser } from '../../Parsers/UserParser';
import {
  CreateMicroCoachUserInput,
  CreateMicroCoachUserMutation,
  CreateMicroCoachUserMutationVariables,
  UpdateMicroCoachUserInput,
  UpdateMicroCoachUserMutation,
  UpdateMicroCoachUserMutationVariables,
  GetMicroCoachUserQuery,
  GetMicroCoachUserQueryVariables,
  MicroCoachUsersByCognitoIdQuery,
  MicroCoachUsersByCognitoIdQueryVariables,
  MicroCoachUsersByEmailQuery,
  MicroCoachUsersByEmailQueryVariables,
  MicroCoachUsersByRoleQuery,
  MicroCoachUsersByRoleQueryVariables,
  UserRole as AWSUserRole,
} from '../../../AWSAPI';
import { createMicroCoachUser, updateMicroCoachUser } from '../../../graphql/mutations';
import {
  getMicroCoachUser,
  microCoachUsersByCognitoId,
  microCoachUsersByEmail,
  microCoachUsersByRole,
} from '../../../graphql/queries';

export const userProfileLocalStorage = 'microcoach_userprofile';

// CRUD + GSI queries for the `User` model, plus the Cognito auth flows that
// resolve into it (login / signup / signout) and the localStorage profile cache.
// Calls are userPool-authed (the User model uses Cognito owner/group auth).
//
// Every read funnels its payload through `UserParser` rather than returning the
// AWS shape as an `IUser`: the two differ in `role` (nominally distinct enums)
// and in the nullability of `teacherName` / `classes`.
//
// `BaseAPIClient.callGraphQL` forwards its `options` argument straight through
// as the operation's `variables`, but declares it as `GraphQLOptions`, which
// only names `input` / `variables` / `authMode`. Query variables therefore need
// the `as unknown as GraphQLOptions` cast below — same idiom as networking's
// UserAPIClient. Fixing the declaration is a BaseAPIClient change that would
// touch every client in the package.
export class UserAPIClient extends BaseAPIClient implements IUserAPIClient{

  async createUser(input: CreateMicroCoachUserInput): Promise<IUser | null> {
    const variables: CreateMicroCoachUserMutationVariables = { input };
    const res = await this.callGraphQL<CreateMicroCoachUserMutation>(
      createMicroCoachUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.createMicroCoachUser)
      return UserParser.parseIUserfromAWSUser(res.data.createMicroCoachUser);
    return null;
  }

  async updateUser(input: UpdateMicroCoachUserInput): Promise<IUser | null> {
    const variables: UpdateMicroCoachUserMutationVariables = { input };
    const res = await this.callGraphQL<UpdateMicroCoachUserMutation>(
      updateMicroCoachUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.updateMicroCoachUser)
      return UserParser.parseIUserfromAWSUser(res.data.updateMicroCoachUser);
    return null;
  }

  async getUser(id: string): Promise<IUser | null> {
    if (!id) return null;
    const variables: GetMicroCoachUserQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachUserQuery>(
      getMicroCoachUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.getMicroCoachUser)
      return UserParser.parseIUserfromAWSUser(res.data.getMicroCoachUser);
    return null;
  }

  // Resolves the backend User row from a Cognito identity — the lookup every
  // auth flow funnels through. Pure: callers decide whether to cache the hit.
  async getUserByCognitoId(cognitoId: string): Promise<IUser | null> {
    if (!cognitoId) return null;
    const variables: MicroCoachUsersByCognitoIdQueryVariables = { cognitoId };
    const res = await this.callGraphQL<MicroCoachUsersByCognitoIdQuery>(
      microCoachUsersByCognitoId,
      variables as unknown as GraphQLOptions,
    );
    const hit = res?.data?.microCoachUsersByCognitoId?.items?.[0];
    return hit ? UserParser.parseIUserfromAWSUser(hit) : null;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    if (!email) return null;
    const variables: MicroCoachUsersByEmailQueryVariables = { email };
    const res = await this.callGraphQL<MicroCoachUsersByEmailQuery>(
      microCoachUsersByEmail,
      variables as unknown as GraphQLOptions,
    );
    const hit = res?.data?.microCoachUsersByEmail?.items?.[0];
    return hit ? UserParser.parseIUserfromAWSUser(hit) : null;
  }

  // Admin listing — "all admins" or "all members" via the byRole GSI. Single
  // page: the roster is small enough that paging on `nextToken` can wait until
  // it isn't.
  async listUsersByRole(role: UserRole): Promise<IUser[]> {
    const variables: MicroCoachUsersByRoleQueryVariables = {
      role: UserParser.parseAWSRolefromUserRole(role),
    };
    const res = await this.callGraphQL<MicroCoachUsersByRoleQuery>(
      microCoachUsersByRole,
      variables as unknown as GraphQLOptions,
    );
    const items = res?.data?.microCoachUsersByRole?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) => UserParser.parseIUserfromAWSUser(item));
  }

  // ── localStorage profile copy ────────────────────────────────────────────
  // Written whenever a profile becomes the signed-in user (login / signup / the
  // on-load resolver). Nothing reads it back yet — `getLocalUserProfile` is the
  // deliberate seam for repopulating app state later, so don't prune it as dead
  // code. Intentionally no refresh-on-read: that would cost an extra round trip.
  getLocalUserProfile(): IUser | null {
    const raw = localStorage.getItem(userProfileLocalStorage);
    return raw ? (JSON.parse(raw) as IUser) : null;
  }

  setLocalUserProfile(profile: IUser): void {
    localStorage.setItem(userProfileLocalStorage, JSON.stringify(profile));
  }

  clearLocalUserProfile(): void {
    localStorage.removeItem(userProfileLocalStorage);
  }

  // Builds the create mutation's input field by field rather than spreading an
  // `IUser`: the profile carries a transient `password` that isn't on the User
  // model, and AppSync rejects unknown input fields.
  //
  // `role` is fixed at TEACHER and never read off the profile — promotion to
  // ADMIN is an admin-side action, not something the signup form gets to post.
  private static buildCreateUserInput(
    cognitoId: string,
    email: string,
    profile: IUser,
  ): CreateMicroCoachUserInput {
    return {
      cognitoId,
      email,
      teacherName: profile.teacherName,
      role: AWSUserRole.TEACHER,
      classes: profile.classes ?? [],
    };
  }

  // ── Email / password login ───────────────────────────────────────────────
  async loginAndRetrieveUserProfile(
    email: string,
    password: string,
  ): Promise<IUser | null> {
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
  async signUpSendConfirmationCode(profile: IUser): Promise<void> {
    console.log(profile);
    console.log(profile.email);
    console.log(profile.password);
    const res = await this.auth.awsSignUp(profile.email, profile.email, profile.password ?? '');
    console.log(res);
  }

  // ── Sign up (step 2: confirm code, sign in, create backend User row) ─────
  async signUpConfirmAndBuildBackendUser(
    profile: IUser,
    confirmationCode: string,
  ): Promise<IUser> {
    const res = await this.auth.awsConfirmSignUp(profile.email, confirmationCode);
    console.log(res);
    console.log('confirm^')
    await this.auth.awsSignIn(profile.email, profile.password ?? '');
    const session = await this.auth.getCurrentSession();
    const cognitoId = session.userSub ?? '';
    const created = await this.createUser(
      UserAPIClient.buildCreateUserInput(cognitoId, profile.email, profile),
    );
    // The Cognito user exists by now, so a null here means the row didn't land:
    // signed in with no profile to render. Fail loudly rather than hand the
    // caller a null it has declared it won't get.
    if (!created) throw new Error('signUp: createUser returned no user');
    this.setLocalUserProfile(created);
    this.auth.isUserAuth = true;
    return created;
  }

  // ── Google sign up (post-federation: build the backend User row) ─────────
  async signUpGoogleBuildBackendUser(profile: IUser): Promise<IUser> {
    const session = await this.auth.getCurrentSession();
    const cognitoId = session.userSub ?? '';
    const email = (await this.auth.getUserEmail()) ?? profile.email;
    const created = await this.createUser(
      UserAPIClient.buildCreateUserInput(cognitoId, email, profile),
    );
    if (!created) throw new Error('googleSignUp: createUser returned no user');
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
