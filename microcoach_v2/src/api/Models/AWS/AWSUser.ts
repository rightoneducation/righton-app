import { UserRole as AWSUserRole } from '../../../AWSAPI'

// Structural mirror of the `User` shape AppSync returns.
//
// Deliberately not an alias of AWSAPI's generated `User`: codegen inlines an
// anonymous object per operation (`CreateUserMutation['createUser']`, the items
// of `UsersByRoleQuery`, …) which is structurally identical but nominally
// distinct, so a single parser needs a shape all of them assign to. `__typename`
// is optional here for the same reason — the operation types require it.
//
// `classes` is a real `[Class]` list on the model (schema.graphql), not a JSON
// blob, and there is no `password` field: the password is transient signup form
// state that never round-trips through the API.
export type AWSClass = {
  __typename?: 'Class'
  id: string
  name: string
}

export type AWSUser = {
  __typename?: 'User'
  id: string
  cognitoId: string
  email: string
  teacherName?: string | null
  classes?: Array<AWSClass | null> | null
  role: AWSUserRole
  createdAt: string
  updatedAt: string
}
