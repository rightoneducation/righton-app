import { PublishStatus, SessionStatus } from '../../../AWSAPI'

export type AWSSession = {
  __typename?: 'MicroCoachSession'
  id: string
  classId: string
  sessionLabel?: string | null
  weekLabel?: string | null
  weekNumber?: number | null
  topic?: string | null
  ccssStandards?: Array<string | null> | null
  status?: SessionStatus | null
  publishStatus?: PublishStatus | null
  studentWorksAnalyzed?: number | null
  studentsWithStrongUnderstanding?: number | null
  studentsWithStrongUnderstandingIds?: Array<string | null> | null
  studentIdsNeedingSupport?: Array<string | null> | null
  ppqAssessmentId?: string | null
  postPpqAssessmentId?: string | null
  pregeneratedNextSteps?: string | null
  evaluationResults?: string | null
  questionStats?: Array<{
    questionNumber: number
    percentCorrect: number
    questionText?: string | null
    options?: Array<{
      letter: string
      text?: string | null
      percentChosen?: number | null
      isCorrect?: boolean | null
      studentNames?: Array<string | null> | null
    } | null> | null
  } | null> | null
  createdAt: string
  updatedAt: string
}
