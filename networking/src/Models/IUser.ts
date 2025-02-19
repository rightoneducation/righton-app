export type IUser = {
  cognitoId: string
  dynamoId: string
  userName: string
  title?: string
  firstName?: string
  lastName?: string
  email: string
  password?: string
  gamesMade?: number
  questionsMade?: number
  frontIdPath?: string
  backIdPath?: string
}