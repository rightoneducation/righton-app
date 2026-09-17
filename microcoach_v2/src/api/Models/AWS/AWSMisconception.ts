import { Badge, DetailStatus, Prevalence } from '../../../AWSAPI'

export type AWSMisconception = {
  __typename?: 'MicroCoachMisconception'
  id: string
  sessionId: string
  classId: string
  rank: number
  badge?: Badge | null
  title: string
  titleCased?: string | null
  shortLabel?: string | null
  description: string
  consequence?: string | null
  prevalence?: Prevalence | null
  detailStatus: DetailStatus
  studentWork?: string | null
  skillContext?: string | null
  createdAt: string
  updatedAt: string
}
