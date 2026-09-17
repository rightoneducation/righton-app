import type {
  ActivityType,
  DetailStatus,
  IActivityPhases,
  IGrouping,
  IRoutine,
} from "../../lib/PipelineModels";

export interface IMicroCoachActivity {
  activityType: ActivityType;
  id: string;
  misconceptionId: string;
  title: string | null;
  isSelected: boolean;
  selectLabel: string;
  detailStatus: DetailStatus;
  routine: IRoutine;
  durationLabel: string | null;
  grouping: IGrouping | null;
  targets: string | null;
  instructionalMove: string | null;
  strategyTag: string | null;
  phases: IActivityPhases | null;
}
