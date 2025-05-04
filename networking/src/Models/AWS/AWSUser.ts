export type AWSUser = {
  id?: string
  userName: string
  title?: string | null
  firstName?: string | null
  lastName?: string | null
  email: string
  password?: string | null
  gamesMade?: number | null
  questionsMade?: number | null
  createdAt?: string
  updatedAt?: string
  owner?: string | null
  frontIdPath?: string | null
  backIdPath?: string | null
  profilePicPath?: string |null
  dynamoId?: string | null
  cognitoId?: string | null
  profilePicPath?: string | null
  favoriteGameTemplateIds?: string | null
  favoriteQuestionTemplateIds?: string | null
}