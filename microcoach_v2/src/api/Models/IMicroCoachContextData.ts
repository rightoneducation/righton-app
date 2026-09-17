import {
  ContextDataType,
  ExemplarQuestion,
  InstructionalStrategy,
  NextStepLesson,
  WalkthroughData,
} from "../../AWSAPI";

export interface IMicroCoachContextData {
  id: string;
  type: ContextDataType;
  title: string;
  gradeLevel: number | null;
  weekNumber: number | null;
  ccssStandards: string[];
  assessmentCode: string | null;
  isReference: boolean;
  nextStepLesson: NextStepLesson | null;
  exemplarQuestions: ExemplarQuestion[];
  strategy: InstructionalStrategy | null;
  walkthroughData: WalkthroughData | null;
  createdAt: string;
  updatedAt: string;
}
