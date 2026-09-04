import { ScreenSize } from './MicroCoachModels';
import { IUserState } from '../hooks/useUserState';

// Wizard state, actions and step-prop shape. Kept out of SignUpWizard itself so
// the steps can type their props without importing the container that renders
// them (that would be an import cycle).

export type SignUpRole = 'TEACHER' | 'ADMIN';

/** How many verification digits the frame draws. */
export const CODE_LENGTH = 6;

export interface ISignUpState {
  role: SignUpRole | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** One entry per box, '' when empty — the shape VerificationCodeInput takes. */
  code: string[];
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
  code: Array(CODE_LENGTH).fill(''),
  classes: [''],
  isVerified: false,
};

// `code` is its own setter: it is an array, so it does not go through the
// string-valued field setter.
export type SignUpField = 'firstName' | 'lastName' | 'email' | 'password';

export interface ISignUpActions {
  setRole: (role: SignUpRole) => void;
  setField: (field: SignUpField, value: string) => void;
  setCode: (code: string[]) => void;
  setVerified: () => void;
  addClass: () => void;
  /** Replaces the whole list — a federated sign-in returns a roster at once. */
  setClasses: (classes: string[]) => void;
  setClass: (index: number, value: string) => void;
  removeClass: (index: number) => void;
}

export interface SignUpStepProps {
  screenSize: ScreenSize;
  state: ISignUpState;
  actions: ISignUpActions;
  user: IUserState;
}

/** Class names the teacher actually typed, ignoring untouched empty rows. */
export function namedClasses(state: ISignUpState): string[] {
  return state.classes.map((name) => name.trim()).filter(Boolean);
}
