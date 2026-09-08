import { IAuthAPIClient } from "../auth/interfaces/IAuthAPIClient";
import { IUserAPIClient } from "../user/interfaces/IUserAPIClient";

export enum Environment {
  Staging = 'staging',
  Developing = 'developing',
  Testing = 'testing',
}

export interface IAPIClients {
  auth: IAuthAPIClient,
  user: IUserAPIClient
}