import { IAuthAPIClient } from './auth/interfaces/IAuthAPIClient';
import { AuthAPIClient } from './auth/AuthAPIClient';
import { UserAPIClient } from './user/UserAPIClient';
import { Environment } from './interfaces/IBaseAPIClient';

// Single app type today; kept for signature parity with central's factory.
export enum AppType {
  MICROCOACH,
}

// Aggregates MicroCoach's client instances. NOTE: Amplify.configure is owned by
// the frontend (it holds the generated aws-exports), so this factory does NOT
// configure Amplify and does NOT instantiate the v1 data `APIClient` (that would
// clobber the global Amplify config — the deferred data/auth coexistence point).
export class APIClients {
  auth: IAuthAPIClient;

  user: UserAPIClient;

  constructor(env: Environment, authClient: IAuthAPIClient) {
    this.auth = authClient;
    this.user = new UserAPIClient(this.auth);
  }

  static async create(env: Environment, appType: AppType): Promise<APIClients> {
    const authClient = new AuthAPIClient();
    return new APIClients(env, authClient);
  }
}
