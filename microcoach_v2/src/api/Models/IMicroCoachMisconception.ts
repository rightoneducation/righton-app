import type {
  DetailStatus,
  IPrevalence,
  ISkillContext,
  IStudentWork,
} from "../../lib/PipelineModels";
import type { IMicroCoachActivity } from "./IMicroCoachActivity";

export interface IMicroCoachMisconception {
  id: string;
  rank: number;
  badge: string | null;
  isRecommendedFocus: boolean;
  title: string;
  titleCased: string;
  shortLabel: string;
  description: string;
  consequence: string;
  prevalence: IPrevalence;
  detailStatus: DetailStatus;
  nextStepActivities: IMicroCoachActivity[];
  studentWork: IStudentWork | null;
  skillContext: ISkillContext | null;
}
