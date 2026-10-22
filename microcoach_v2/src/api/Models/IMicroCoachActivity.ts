import type {
  ActivityType,
  DetailStatus,
  IGrouping,
  IRoutine,
} from "../../lib/PipelineModels";
import type { IActivityContent } from "../../lib/ActivityContentModels";

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
  /** The template content; null for rows written before the Wave 2 shape. */
  content: IActivityContent | null;
}
