import { ScreenSize } from './MicroCoachModels';
import { IUserState } from '../hooks/useUserState';

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
  isSubmitted: boolean;
}

export const initialUploadState: IUploadState = {
  exemplar: null,
  responses: null,
  isSubmitted: false,
};

export interface IUploadActions {
  completeFile: (slot: UploadSlot) => void;
  failFile: (slot: UploadSlot) => void;
  clearFile: (slot: UploadSlot) => void;
  submit: () => void;
}

export interface UploadStepProps {
  screenSize: ScreenSize;
  upload: IUploadState;
  actions: IUploadActions;
  user: IUserState;
}
