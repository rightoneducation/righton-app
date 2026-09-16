import { IUser, UserRole } from '../Models/IUser';
import { AWSUser } from '../Models/AWS/AWSUser';
import {
  CreateMicroCoachUserInput,
  UserRole as AWSUserRole,
} from '../../AWSAPI';
import { isNullOrUndefined } from '../util/util';

/*
 * Boundary between the generated AWS shapes and the app's own `IUser`.
 *
 * The two vocabularies deliberately differ, and the mapping lives HERE rather
 * than being pushed out into the pages:
 *
 *   schema `MEMBER`      <-> app `TEACHER`
 *
 * Keeping the app side stable means a schema rename touches this file and
 * UserAPIClient, not every screen. (The model is expected to become
 * `MicroCoachUser` shortly, which is exactly that kind of churn.)
 *
 * Do not "tidy" TEACHER into MEMBER to match the wire — the app vocabulary is
 * the one the UI is written in.
 */
export class UserParser {
  static parseIUserfromAWSUser(user: AWSUser): IUser {
    if (
      isNullOrUndefined(user.id) ||
      isNullOrUndefined(user.cognitoId) ||
      isNullOrUndefined(user.email) ||
      isNullOrUndefined(user.role) ||
      isNullOrUndefined(user.createdAt) ||
      isNullOrUndefined(user.updatedAt)
    ) {
      throw new Error(
        'User has null field for the attributes that are not nullable',
      );
    }

    const parsedUser: IUser = {
      id: user.id,
      cognitoId: user.cognitoId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      // `classes` is a @hasMany relation, not a field on the row. Nothing reads
      // it off User today; class names would come from their own Class rows.
      classes: [],
      role: user.role === AWSUserRole.ADMIN ? UserRole.ADMIN : UserRole.TEACHER,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    // `password` is intentionally absent: transient signup state, never stored
    // on the User model and never returned by AppSync.
    return parsedUser;
  }

  static parseAWSUserInputfromIUser(user: IUser): CreateMicroCoachUserInput {
    if (
      isNullOrUndefined(user.cognitoId) ||
      isNullOrUndefined(user.role)
    ) {
      throw new Error(
        'User has null field for the attributes required to mutate it',
      );
    }

    return {
      id: user.id,
      cognitoId: user.cognitoId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: this.parseAWSRolefromUserRole(user.role),
    };
  }

  static parseAWSRolefromUserRole(role: UserRole): AWSUserRole {
    return role === UserRole.ADMIN ? AWSUserRole.ADMIN : AWSUserRole.MEMBER;
  }
}
