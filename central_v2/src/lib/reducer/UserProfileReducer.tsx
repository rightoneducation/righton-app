import { IUserProfile } from "@righton/networking";
import { IAction } from "./IUserProfileReducer";

export default function UserProfileReducer(userProfile: IUserProfile | null, action: IAction): IUserProfile | null{
  const { type, payload } = action;
  
  switch(type){
    case 'update_user_profile':
      return {...userProfile, ...payload};
    default:
      return userProfile;
  }
}