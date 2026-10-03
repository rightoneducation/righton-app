import { ScreenSize } from './MicroCoachModels';
import { IUserState } from '../hooks/useUserState';
import { IClassroomsState } from '../hooks/useClassrooms';

// Upload state, actions and step-prop shape — split out of UploadFlow for the
// same reason as SignUpModels: the steps type their props from here.

export type UploadSlot = 'exemplar' | 'responses';
export type UploadStatus = 'COMPLETE' | 'ERROR';

export interface IUploadFile {
  name: string;
  status: UploadStatus;
}

export interface IUploadState {
  exemplar: IUploadFile | null;
  responses: IUploadFile | null;
  /** Monday of the week this upload covers, local `YYYY-MM-DD` (lib/weeks). */
  weekStart: string;
  isSubmitted: boolean;
}

export const initialUploadState: IUploadState = {
  exemplar: null,
  responses: null,
  // Filled when the flow mounts (UploadFlow), not here: a module-level date
  // would go stale in a tab left open across a week boundary.
  weekStart: '',
  isSubmitted: false,
};

export interface IUploadActions {
  completeFile: (slot: UploadSlot) => void;
  failFile: (slot: UploadSlot) => void;
  clearFile: (slot: UploadSlot) => void;
  setWeek: (weekStart: string) => void;
  submit: () => void;
}

export interface UploadStepProps {
  screenSize: ScreenSize;
  upload: IUploadState;
  actions: IUploadActions;
  user: IUserState;
  classrooms: IClassroomsState;
}
