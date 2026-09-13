import {
  ActivityType, DetailStatus, Grouping
} from "../../../AWSAPI"


export type AWSActivity = {
  __typename?: 'MicroCoachActivity'
  id: string
  misconceptionId: string
  sessionId: string
  classId: string
  activityType: ActivityType
  title?: string | null
  isSelected?: boolean | null
  selectLabel?: string | null
  detailStatus: DetailStatus
  routine?: string | null
  durationMinutes?: number | null
  durationLabel?: string | null
  grouping?: Grouping | null
  targets?: string | null
  instructionalMove?: string | null
  strategyTag?: string | null
  phases?: string | null
  createdAt: string
  updatedAt: string
}
