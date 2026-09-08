import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { SignUpStepProps, CODE_LENGTH } from '../lib/SignUpModels';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import VerificationCodeInput from '../components/VerificationCodeInput';
import {
  SignUpColumn,
  SignUpHeading,
  SignUpPill,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpVerify({ apiClients, screenSize, state, actions, user }: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const isReady = useAllReady(useI18nReady());

  const [didResend, setDidResend] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  // Confirming is four round trips (confirm, sign-in, session, row creation),
  // so the pill needs to show that something is happening.
  const [isVerifying, setIsVerifying] = React.useState(false);

  if (!state.role) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const isComplete = state.code.filter(Boolean).length === CODE_LENGTH;

  const handleVerify = async () => {
    if (!isComplete) {
      setHasError(true);
      return;
    }
    console.log('verify');
    setIsVerifying(true);
    try {
      // Keep the created row: it carries the `id` the final step needs to write
      // the classes back, and nothing else in the wizard has it. Status stays
      // put — SignUpSelect is what presents the user as signed in.
      const created = await apiClients.user.signUpConfirmAndBuildBackendUser(
        state,
        state.code.join('')
      );
      // updateUserProfile, not signIn: signIn would flip status to LOGGEDIN and
      // AuthGuard's keep-out would eject them from the rest of the wizard.
      user.updateUserProfile(created);
      // Record the verification before moving on: /signup/classes gates on
      // state.isVerified, so navigating without this bounces straight back to
      // /signup. The Google path already does the same in handleGoogle.
      actions.setVerified();
      navigate('/signup/classes');
    } catch (error) {
      // The try above covers four operations — confirm, sign-in, session fetch
      // and the backend row creation — so the failure is often not the code the
      // user typed. Log the error itself or the message names the wrong step.
      console.error('Verification error', error);
      setHasError(true);
    } finally {
      setIsVerifying(false);
    }
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
            actions.setCode(code);
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

        {/* The spinner replaces the label rather than sitting beside it: the
            pill's minWidth/minHeight hold its size, so nothing in the column
            shifts. `disabled` also blocks the double-submit that would fire a
            second confirmSignUp and fail once the first one lands. Colour is
            set explicitly because SignUpPill has no Mui-disabled rule, so
            MUI's default greys out anything inheriting `color`. */}
        <SignUpPill
          disableElevation
          disabled={isVerifying}
          onClick={handleVerify}
        >
          {isVerifying ? (
            <CircularProgress
              size={20}
              aria-label={t('signup.verify')}
              sx={{ color: 'designSystem.surface.white' }}
            />
          ) : (
            t('signup.verify')
          )}
        </SignUpPill>
      </SignUpColumn>
    </AppContentRow>
  );
}
