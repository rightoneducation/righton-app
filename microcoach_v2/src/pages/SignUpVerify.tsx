import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import VerificationCodeInput from '../components/VerificationCodeInput';
import { CODE_LENGTH } from '../lib/context/SignUpContext';
import {
  useSignUpDispatch,
  useSignUpState,
} from '../hooks/context/useSignUpContext';
import {
  SignUpColumn,
  SignUpHeading,
  SignUpPill,
  SignUpSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpVerify({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const state = useSignUpState();
  const dispatch = useSignUpDispatch();
  const isReady = useAllReady(useI18nReady());

  const [didResend, setDidResend] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  if (!state.role) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const isComplete = state.code.filter(Boolean).length === CODE_LENGTH;

  const handleVerify = () => {
    if (!isComplete) {
      setHasError(true);
      return;
    }
    // Mocked: any six digits pass.
    dispatch({ type: 'SET_VERIFIED' });
    navigate('/signup/classes');
  };

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpStepper current={2} />
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.verifyTitle')}</SignUpSubheading>

        <Typography
          variant="rubikBody"
          sx={{
            color: 'designSystem.surface.darkBlue',
            textAlign: 'center',
          }}
        >
          {t('signup.verifyBody')}
        </Typography>

        <VerificationCodeInput
          autoFocus
          code={state.code}
          hasError={hasError}
          onCodeChange={(code) => {
            dispatch({ type: 'SET_CODE', payload: code });
            // Clear the error the moment they start correcting it, rather
            // than leaving the boxes red while they retype.
            setHasError(false);
          }}
        />

        {/* Figma keeps the message in accentBlue rather than red — the box
            outlines carry the error — and sets it in flow between the boxes
            and Resend, so the Verify pill is pushed down rather than the
            column reserving space for it. */}
        {hasError && (
          <Typography
            variant="rubikLabel"
            role="alert"
            sx={{
              color: 'designSystem.foreground.accentBlue',
              textAlign: 'center',
            }}
          >
            {t('signup.codeError')}
          </Typography>
        )}

        <Stack alignItems="center" spacing={`${theme.sizing.space1}px`}>
          {/* A real button: it performs an action rather than navigating,
              so an anchor would be the wrong element. */}
          <Button
            variant="text"
            onClick={() => setDidResend(true)}
            sx={{
              ...theme.typography.rubikBody,
              color: 'designSystem.surface.darkBlue',
              textTransform: 'none',
              textDecoration: 'underline',
            }}
          >
            {t('signup.resend')}
          </Button>
          {didResend && (
            <Typography
              variant="smallBodyText"
              role="status"
              sx={{ color: 'designSystem.status.success' }}
            >
              {t('signup.resendSent')}
            </Typography>
          )}
        </Stack>

        <SignUpPill disableElevation onClick={handleVerify}>
          {t('signup.verify')}
        </SignUpPill>
      </SignUpColumn>
    </AppContentRow>
  );
}
