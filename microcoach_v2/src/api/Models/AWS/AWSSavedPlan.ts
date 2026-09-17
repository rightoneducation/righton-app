import { Item } from '../../../AWSAPI'

export type AWSSavedPlan = {
  __typename?: 'MicroCoachSavedPlan'
  id: string
  classId: string
  sessionId?: string | null
  items?: Array<Item | null> | null
  createdAt: string
  updatedAt: string
}
