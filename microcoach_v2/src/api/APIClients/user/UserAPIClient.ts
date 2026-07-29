import { generateClient } from 'aws-amplify/api';
import { IUserProfile, UserRole } from '../../Models/IUser';
import {
  createUser,
  updateUser,
  getUser,
  usersByCognitoId,
  usersByEmail,
  usersByRole,
} from '../../graphql/user';

// CRUD + GSI queries for the `User` model. Calls are userPool-authed (the User
// model uses Cognito owner/group auth). Loose `any` typing matches the existing
// ported APIClient style in this package.
export class UserAPIClient {
  private client: any;

  constructor() {
    this.client = generateClient({});
  }

  private async call<T = any>(query: any, variables?: Record<string, unknown>): Promise<T> {
    return this.client.graphql({ query, variables, authMode: 'userPool' });
  }

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
}
