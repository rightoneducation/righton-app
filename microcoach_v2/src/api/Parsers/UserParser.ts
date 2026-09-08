import { IUser, IClass, UserRole } from '../Models/IUser';
import { AWSUser, AWSClass } from '../Models/AWS/AWSUser';
import { UserRole as AWSUserRole } from '../../AWSAPI';

// Boundary between the generated AWS shapes and the app's own `IUser`. The two
// role enums are nominally distinct in TypeScript despite identical members, so
// every crossing goes through one of the two mappers below — that way a codegen
// re-run can't ripple into app code.
export class UserParser {
  static parseIClassfromAWSClass(cls: AWSClass): IClass {
    return { id: cls.id, name: cls.name };
  }

  static parseIUserfromAWSUser(user: AWSUser): IUser {
    const parsedUser: IUser = {
      id: user.id,
      cognitoId: user.cognitoId,
      email: user.email,
      teacherName: user.teacherName ?? '',
      // A list, not a JSON string — nulls are possible per-item because the
      // schema declares `[Class]` rather than `[Class!]!`.
      classes: (user.classes ?? [])
        .filter((cls): cls is AWSClass => cls != null)
        .map(UserParser.parseIClassfromAWSClass),
      role: user.role === AWSUserRole.ADMIN ? UserRole.ADMIN : UserRole.MEMBER,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    // `password` is intentionally absent: transient signup state, never stored
    // on the User model and never returned by AppSync.
    return parsedUser;
  }

  static parseAWSRolefromUserRole(role: UserRole): AWSUserRole {
    return role === UserRole.ADMIN ? AWSUserRole.ADMIN : AWSUserRole.MEMBER;
  }
}
