export interface IUser {
  id: string
  cognitoId?: string
  dynamoId?: string
  username: string
  title?: string
  firstName?: string
  lastName?: string
  email: string
  password?: string
  gamesMade?: number
  questionsMade?: number
  frontIdPath?: string
  backIdPath?: string
  favoriteGameTemplateIds?: string[]
  favoriteQuestionTemplateIds?: string[]
}