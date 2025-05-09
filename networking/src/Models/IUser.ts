export interface IUser {
  id: string
  cognitoId?: string
  dynamoId?: string
  userName: string
  title?: string
  firstName?: string
  lastName?: string
  email: string
  password?: string
  gamesMade?: number
  gamesUsed?: number
  questionsMade?: number
  frontIdPath?: string
  backIdPath?: string
  profilePicPath?: string
  favoriteGameTemplateIds?: string[]
  favoriteQuestionTemplateIds?: string[]
  createdAt?: string
}