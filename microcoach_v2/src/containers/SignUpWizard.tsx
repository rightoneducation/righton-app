import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ISignUpState,
  ISignUpActions,
  SignUpStepProps,
  initialSignUpState,
} from '../lib/SignUpModels';
import { IUserState } from '../hooks/useUserState';
import SignUpRole from '../pages/SignUpRole';
import SignUpRegister from '../pages/SignUpRegister';
import SignUpVerify from '../pages/SignUpVerify';
import SignUpClasses from '../pages/SignUpClasses';
import SignUpSelect from '../pages/SignUpSelect';

/**
 * The sign-up wizard, steps and all.
 *
 * The five steps used to be five routes sharing a context, which is the only
 * reason their scratch state needed a holder above them. They are one component
 * now: `signup/*` is a single route match, so this element stays mounted while
 * only the URL tail changes, and the wizard's state is ordinary useState that
 * dies when the flow is left. No provider, no reset action — leaving unmounts.
 *
 * The steps keep their own navigate() calls and their own URLs, so deep links
 * and Back between steps work exactly as before.
 */

interface SignUpWizardProps {
  screenSize: ScreenSize;
  user: IUserState;
}

export default function SignUpWizard({ screenSize, user }: SignUpWizardProps) {
  const [state, setState] = useState<ISignUpState>(initialSignUpState);
  const step = useParams()['*'] ?? '';

  const actions: ISignUpActions = {
    setRole: (role) => setState((s) => ({ ...s, role })),
    setField: (field, value) => setState((s) => ({ ...s, [field]: value })),
    setCode: (code) => setState((s) => ({ ...s, code })),
    setVerified: () => setState((s) => ({ ...s, isVerified: true })),
    addClass: () => setState((s) => ({ ...s, classes: [...s.classes, ''] })),
    setClasses: (classes) => setState((s) => ({ ...s, classes })),
    setClass: (index, value) =>
      setState((s) => ({
        ...s,
        classes: s.classes.map((name, i) => (i === index ? value : name)),
      })),
    removeClass: (index) =>
      setState((s) => ({
        ...s,
        classes: s.classes.filter((unused, i) => i !== index),
      })),
  };

  const stepProps: SignUpStepProps = { screenSize, state, actions, user };

  switch (step) {
    case 'register':
      return <SignUpRegister {...stepProps} />;
    case 'verify':
      return <SignUpVerify {...stepProps} />;
    case 'classes':
      return <SignUpClasses {...stepProps} />;
    case 'select':
      return <SignUpSelect {...stepProps} />;
    default:
      return <SignUpRole {...stepProps} />;
  }
}
