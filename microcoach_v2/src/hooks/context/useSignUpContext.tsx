import { useContext } from 'react';
import {
  ISignUpState,
  SignUpAction,
  SignUpDispatchContext,
  SignUpStateContext,
} from '../../lib/context/SignUpContext';

/** Mirrors the useMicroCoachDataContext pair so the two read the same way. */
export function useSignUpState(): ISignUpState {
  return useContext(SignUpStateContext);
}

export function useSignUpDispatch(): React.Dispatch<SignUpAction> {
  return useContext(SignUpDispatchContext);
}
