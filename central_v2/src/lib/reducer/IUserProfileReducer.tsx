import { IUserProfile } from '@righton/networking';

export interface IUserProfileReducer {
  update_user_profile: (userProfile: IUserProfile) => void;
}

export interface IAction {
  type: string;
  payload?: any;
}
