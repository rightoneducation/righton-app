import { useContext } from 'react';
import {
  IUploadState,
  UploadAction,
  UploadDispatchContext,
  UploadStateContext,
} from '../../lib/context/UploadContext';

/** Mirrors the other context hook pairs so all three read the same way. */
export function useUploadState(): IUploadState {
  return useContext(UploadStateContext);
}

export function useUploadDispatch(): React.Dispatch<UploadAction> {
  return useContext(UploadDispatchContext);
}
