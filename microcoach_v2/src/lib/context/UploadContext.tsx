import React, { ReactNode, createContext, useMemo, useReducer } from 'react';

/**
 * The two RTD files being uploaded.
 *
 * Shared rather than page-local because the review step lists the same file
 * names back before submitting, and going "Back to upload" has to find them
 * still there.
 */

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

/** The file names the frames show, so the demo reads as the design does. */
const MOCK_FILE_NAMES: Record<UploadSlot, string> = {
  exemplar: 'ALG_W36_COACH_Exemplar.docx',
  responses: 'W36_PPQ_Responses.xlsx',
};

export type UploadAction =
  | { type: 'COMPLETE_FILE'; payload: UploadSlot }
  | { type: 'FAIL_FILE'; payload: UploadSlot }
  | { type: 'CLEAR_FILE'; payload: UploadSlot }
  | { type: 'SUBMIT' }
  | { type: 'RESET' };

export function uploadReducer(
  state: IUploadState,
  action: UploadAction,
): IUploadState {
  switch (action.type) {
    case 'COMPLETE_FILE':
      return {
        ...state,
        [action.payload]: {
          name: MOCK_FILE_NAMES[action.payload],
          status: 'COMPLETE',
        },
      };
    case 'FAIL_FILE':
      return {
        ...state,
        [action.payload]: {
          name: MOCK_FILE_NAMES[action.payload],
          status: 'ERROR',
        },
      };
    case 'CLEAR_FILE':
      return { ...state, [action.payload]: null };
    case 'SUBMIT':
      return { ...state, isSubmitted: true };
    case 'RESET':
      return initialUploadState;
    default:
      return state;
  }
}

export const UploadStateContext =
  createContext<IUploadState>(initialUploadState);
export const UploadDispatchContext = createContext<
  React.Dispatch<UploadAction>
>(() => undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploadReducer, initialUploadState);
  const value = useMemo(() => state, [state]);

  return (
    <UploadStateContext.Provider value={value}>
      <UploadDispatchContext.Provider value={dispatch}>
        {children}
      </UploadDispatchContext.Provider>
    </UploadStateContext.Provider>
  );
}
