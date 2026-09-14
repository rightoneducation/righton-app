import {
  ContextDataType,
  ExemplarQuestion,
  InstructionalStrategy,
  NextStepLesson,
  WalkthroughData,
} from '../../../AWSAPI'

export type AWSContextData = {
  __typename?: 'ContextData'
  id: string
  type: ContextDataType
  title: string
  gradeLevel?: number | null
  weekNumber?: number | null
  ccssStandards?: Array<string | null> | null
  assessmentCode?: string | null
  isReference?: boolean | null
  nextStepLesson?: NextStepLesson | null
  exemplarQuestions?: Array<ExemplarQuestion | null> | null
  strategy?: InstructionalStrategy | null
  walkthroughData?: WalkthroughData | null
  createdAt: string
  updatedAt: string
}
