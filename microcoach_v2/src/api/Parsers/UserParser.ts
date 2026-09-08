import { IUser, UserRole } from '../Models/IUser';
import { AWSUser } from '../Models/AWS/AWSUser';
import { UserRole as AWSUserRole } from '../../AWSAPI';

// Boundary between the generated AWS shapes and the app's own `IUser`. The two
// role enums are nominally distinct in TypeScript despite identical members, so
// every crossing goes through one of the two mappers below — that way a codegen
// re-run can't ripple into app code.
export class UserParser {
  static parseIUserfromAWSUser(user: AWSUser): IUser {
    const parsedUser: IUser = {
      id: user.id,
      cognitoId: user.cognitoId,
      email: user.email,
      teacherName: user.teacherName ?? '',
      // Per-item nulls are possible because the schema declares `[String]`
      // rather than `[String!]!`.
      classes: (user.classes ?? []).filter((cls): cls is string => cls != null),
      role: user.role === AWSUserRole.ADMIN ? UserRole.ADMIN : UserRole.TEACHER,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    // `password` is intentionally absent: transient signup state, never stored
    // on the User model and never returned by AppSync.
    return parsedUser;
  }

  static parseAWSRolefromUserRole(role: UserRole): AWSUserRole {
    return role === UserRole.ADMIN ? AWSUserRole.ADMIN : AWSUserRole.TEACHER;
  }
}
