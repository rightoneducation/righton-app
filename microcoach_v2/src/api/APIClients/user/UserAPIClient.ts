import { BaseAPIClient, GraphQLOptions } from '../base/BaseAPIClient';
import { IUserAPIClient } from './interfaces/IUserAPIClient';
import { IUser, UserRole } from '../../Models/IUser';
import { UserParser } from '../../Parsers/UserParser';
import {
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
  UsersByCognitoIdQuery,
  UsersByCognitoIdQueryVariables,
  UsersByEmailQuery,
  UsersByEmailQueryVariables,
  UsersByRoleQuery,
  UsersByRoleQueryVariables,
  UserRole as AWSUserRole,
} from '../../../AWSAPI';
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
//
// Every read funnels its payload through `UserParser` rather than returning the
// AWS shape as an `IUser`: the two differ in `role`, which are nominally
// distinct enums with the same members.
//
// `BaseAPIClient.callGraphQL` forwards its `options` argument straight through
// as the operation's `variables`, but declares it as `GraphQLOptions`, which
// only names `input` / `variables` / `authMode`. Query variables therefore need
// the `as unknown as GraphQLOptions` cast below — same idiom as networking's
// UserAPIClient. Fixing the declaration is a BaseAPIClient change that would
// touch every client in the package.
export class UserAPIClient extends BaseAPIClient implements IUserAPIClient{

  async createUser(input: CreateUserInput): Promise<IUser | null> {
    const variables: CreateUserMutationVariables = { input };
    const res = await this.callGraphQL<CreateUserMutation>(
      createUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.createUser)
      return UserParser.parseIUserfromAWSUser(res.data.createUser);
    return null;
  }

  async updateUser(input: UpdateUserInput): Promise<IUser | null> {
    const variables: UpdateUserMutationVariables = { input };
    const res = await this.callGraphQL<UpdateUserMutation>(
      updateUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.updateUser)
      return UserParser.parseIUserfromAWSUser(res.data.updateUser);
    return null;
  }

  async getUser(id: string): Promise<IUser | null> {
    if (!id) return null;
    const variables: GetUserQueryVariables = { id };
    const res = await this.callGraphQL<GetUserQuery>(
      getUser,
      variables as unknown as GraphQLOptions,
    );
    if (res?.data?.getUser)
      return UserParser.parseIUserfromAWSUser(res.data.getUser);
    return null;
  }

  // Resolves the backend User row from a Cognito identity — the lookup every
  // auth flow funnels through. Pure: callers decide whether to cache the hit.
  async getUserByCognitoId(cognitoId: string): Promise<IUser | null> {
    if (!cognitoId) return null;
    const variables: UsersByCognitoIdQueryVariables = { cognitoId };
    const res = await this.callGraphQL<UsersByCognitoIdQuery>(
      usersByCognitoId,
      variables as unknown as GraphQLOptions,
    );
    const hit = res?.data?.usersByCognitoId?.items?.[0];
    return hit ? UserParser.parseIUserfromAWSUser(hit) : null;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    if (!email) return null;
    const variables: UsersByEmailQueryVariables = { email };
    const res = await this.callGraphQL<UsersByEmailQuery>(
      usersByEmail,
      variables as unknown as GraphQLOptions,
    );
    const hit = res?.data?.usersByEmail?.items?.[0];
    return hit ? UserParser.parseIUserfromAWSUser(hit) : null;
  }

  // Admin listing — "all admins" or "all members" via the byRole GSI. Single
  // page: the roster is small enough that paging on `nextToken` can wait until
  // it isn't.
  async listUsersByRole(role: UserRole): Promise<IUser[]> {
    const variables: UsersByRoleQueryVariables = {
      role: UserParser.parseAWSRolefromUserRole(role),
    };
    const res = await this.callGraphQL<UsersByRoleQuery>(
      usersByRole,
      variables as unknown as GraphQLOptions,
    );
    const items = res?.data?.usersByRole?.items ?? [];
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
  // `role` is fixed at MEMBER (the wire spelling of the app's TEACHER) and
  // never read off the profile — promotion to ADMIN is an admin-side action,
  // not something the signup form gets to post.
  //
  // `classes` is absent on purpose: it is a @hasMany relation, so it is not a
  // field on CreateUserInput at all. Class names collected by the wizard are
  // not persisted yet — they would need their own Class rows keyed by userId.
  private static buildCreateUserInput(
    cognitoId: string,
    email: string,
    profile: IUser,
  ): CreateUserInput {
    return {
      cognitoId,
      email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: AWSUserRole.MEMBER,
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
    // Trust the caller's email when it has one — AuthCallback resolves it from
    // the Google popup. getUserEmail is a fallback only: it needs the
    // `aws.cognito.signin.user.admin` scope, which the app clients do not
    // grant, so calling it unconditionally logs a 400 on every Google signup.
    const email = profile.email || (await this.auth.getUserEmail()) || '';
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
