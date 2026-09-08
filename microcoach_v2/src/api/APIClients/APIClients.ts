import { Amplify } from "aws-amplify";
import { IAuthAPIClient } from './auth/interfaces/IAuthAPIClient';
import { AuthAPIClient } from './auth/AuthAPIClient';
import { UserAPIClient } from './user/UserAPIClient';
import { Environment } from './interfaces/IAPIClients';
import awsconfig from "../../aws-exports";

// Single app type today; kept for signature parity with central's factory.
export enum AppType {
  MICROCOACH,
}

export class APIClients {
  auth: IAuthAPIClient;
  user: UserAPIClient;

  constructor(env: Environment, authClient: IAuthAPIClient) {
    this.configAmplify(awsconfig);
    this.auth = authClient;
    this.user = new UserAPIClient(env, this.auth);
  }

  static async create(env: Environment, appType: AppType): Promise<APIClients> {
    const authClient = new AuthAPIClient();
    return new APIClients(env, authClient);
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}
