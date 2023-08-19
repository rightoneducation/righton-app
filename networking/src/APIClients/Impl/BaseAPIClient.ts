import awsconfig from "../../aws-exports";
import localawsconfig from "../../aws-exports-local";
import { Amplify } from "aws-amplify";

export enum HTTPMethod {
  Post = "POST",
}

export enum Environment {
  Staging = "staging",
  Local = "local",
}

export abstract class BaseAPIClient {
  protected endpoint: string;
  protected env: Environment;

  constructor(env: Environment) {
    this.env = env;
    switch (env) {
      case Environment.Local:
        Amplify.configure(localawsconfig);
        this.endpoint = ``;
        break;
      case Environment.Staging:
        Amplify.configure(awsconfig);
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
        break;
    }
  }
}
