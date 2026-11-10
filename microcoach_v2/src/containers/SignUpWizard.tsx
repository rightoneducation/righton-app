import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ISignUpState,
  ISignUpActions,
  SignUpStepProps,
  SignUpVerifyHandoff,
  initialSignUpState,
} from '../lib/SignUpModels';
import { IAPIClients, UserRole } from '../api';
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
  apiClients: IAPIClients;
  screenSize: ScreenSize;
  setSignedInUser: IUserState['setSignedInUser'];
  updateUserProfile: IUserState['updateUserProfile'];
}

export default function SignUpWizard({
  apiClients,
  screenSize,
  setSignedInUser,
  updateUserProfile,
}: SignUpWizardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  // Log in sends an unverified account here with its credentials (and a code
  // already on its way). Teacher is the only role sign-up creates today, and
  // the names come back from Cognito when verify builds the User row.
  const [state, setState] = useState<ISignUpState>(() => {
    const handoff = location.state as SignUpVerifyHandoff | null;
    if (!handoff?.email) return initialSignUpState;
    return {
      ...initialSignUpState,
      role: UserRole.TEACHER,
      email: handoff.email,
      password: handoff.password,
    };
  });
  const step = useParams()['*'] ?? '';

  // Read once into state above; drop it from history straight away so the
  // password doesn't survive in history.state (refresh, Back, devtools).
  useEffect(() => {
    if ((location.state as SignUpVerifyHandoff | null)?.email) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // Mount only: the handoff is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const stepProps: SignUpStepProps = {
    apiClients,
    screenSize,
    state,
    actions,
    setSignedInUser,
    updateUserProfile,
  };

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
