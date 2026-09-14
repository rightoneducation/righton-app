import { AssessmentType } from "../../../AWSAPI"



export type AWSAssessment = {
  __typename?: 'MicroCoachAssessment'
  id: string
  classId: string
  sessionId: string
  assessmentCode: string
  type: AssessmentType
  weekNumber: number

  createdAt: string
  updatedAt: string
}
