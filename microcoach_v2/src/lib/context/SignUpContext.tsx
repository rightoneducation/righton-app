import React, { ReactNode, createContext, useMemo, useReducer } from 'react';

/**
 * In-progress state for the sign-up wizard.
 *
 * Deliberately separate from MicroCoachDataContext: this is scratch data that
 * only exists between /signup and /signup/select, and the whole module goes
 * away when the real API lands. The finished profile is handed to the app's
 * own reducer at the last step, so nothing downstream learns about this.
 */

export type SignUpRole = 'TEACHER' | 'ADMIN';

/** How many verification digits the frame draws. */
export const CODE_LENGTH = 6;

export interface ISignUpState {
  role: SignUpRole | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
  /** Starts with one empty row — the frame shows a single field by default. */
  classes: string[];
  isVerified: boolean;
}

export const initialSignUpState: ISignUpState = {
  role: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  code: '',
  classes: [''],
  isVerified: false,
};

export type SignUpField =
  'firstName' | 'lastName' | 'email' | 'password' | 'code';

export type SignUpAction =
  | { type: 'SET_ROLE'; payload: SignUpRole }
  | { type: 'SET_FIELD'; payload: { field: SignUpField; value: string } }
  | { type: 'SET_VERIFIED' }
  | { type: 'ADD_CLASS' }
  | { type: 'SET_CLASS'; payload: { index: number; value: string } }
  | { type: 'REMOVE_CLASS'; payload: number }
  | { type: 'RESET' };

export function signUpReducer(
  state: ISignUpState,
  action: SignUpAction,
): ISignUpState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_VERIFIED':
      return { ...state, isVerified: true };
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, ''] };
    case 'SET_CLASS':
      return {
        ...state,
        classes: state.classes.map((name, index) =>
          index === action.payload.index ? action.payload.value : name,
        ),
      };
    case 'REMOVE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(
          (unused, index) => index !== action.payload,
        ),
      };
    case 'RESET':
      return initialSignUpState;
    default:
      return state;
  }
}

/** Class names the teacher actually typed, ignoring untouched empty rows. */
export function namedClasses(state: ISignUpState): string[] {
  return state.classes.map((name) => name.trim()).filter(Boolean);
}

export const SignUpStateContext =
  createContext<ISignUpState>(initialSignUpState);
export const SignUpDispatchContext = createContext<
  React.Dispatch<SignUpAction>
>(() => undefined);

export function SignUpProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(signUpReducer, initialSignUpState);
  // The state object is already a fresh reference per action, but the pair
  // would otherwise remount every consumer on any parent render.
  const value = useMemo(() => state, [state]);

  return (
    <SignUpStateContext.Provider value={value}>
      <SignUpDispatchContext.Provider value={dispatch}>
        {children}
      </SignUpDispatchContext.Provider>
    </SignUpStateContext.Provider>
  );
}
