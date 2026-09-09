import { UserRole as AWSUserRole } from '../../../AWSAPI'

// Structural mirror of the `User` shape AppSync returns.
//
// Deliberately not an alias of AWSAPI's generated `User`: codegen inlines an
// anonymous object per operation (`CreateUserMutation['createUser']`, the items
// of `UsersByRoleQuery`, …) which is structurally identical but nominally
// distinct, so a single parser needs a shape all of them assign to. `__typename`
// is optional here for the same reason — the operation types require it.
//
// Two things this does NOT carry:
//  - `classes`. It is a `@hasMany` relation on the model, so the field resolves
//    to a ModelClassConnection and is absent from CreateUserInput entirely.
//    Class names live in their own Class rows keyed by `userId`.
//  - `password`. Transient signup form state that never round-trips.
//
// The schema calls the display name `name`; the app calls it `teacherName`.
// UserParser is where those meet — see the note there.
export type AWSUser = {
  __typename?: 'User'
  id: string
  cognitoId: string
  email: string
  name?: string | null
  role: AWSUserRole
  createdAt: string
  updatedAt: string
}
