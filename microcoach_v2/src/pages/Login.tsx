import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useGoogleLogin } from '@react-oauth/google';
import {
  fetchGoogleProfile,
  stashGoogleProfile,
} from '../lib/googleProfileStash';
import { IAPIClients } from '../api';
import AppContentRow from '../components/AppContentRow';
import { EMPTY_CREDENTIALS_ERROR, IUserState } from '../hooks/useUserState';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import {
  FieldErrorIcon,
  FORM_COLUMN,
  GoogleButton,
  GoogleMark,
  OrDivider,
  SignUpColumn,
  SignUpField,
  SignUpHeading,
  SignUpPill,
  SignUpPillMuted,
  SignUpSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import VerifyAccountDialog from '../components/VerifyAccountDialog';
import { SignUpVerifyHandoff } from '../lib/SignUpModels';
import googleIcon from '../images/googleicon.svg';
import errorIcon from '../images/errorIcon.svg';
import loginIconWhite from '../images/loginIconWhite.svg';
import signupIconWhite from '../images/signupIconWhite.svg';

interface LoginProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  signIn: IUserState['signIn'];
  setUserErrorString: IUserState['setUserErrorString'];
}

export default function Login({
  apiClients,
  screenSize,
  signIn,
  setUserErrorString,
}: LoginProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { userErrorString } = useMicroCoachDataState();
  const isReady = useAllReady(useI18nReady());

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  // The empty-fields prompt goes on the first keystroke in either field. Other
  // sign-in errors (wrong password, no account) stay put while they retype.
  const clearEmptyFieldsError = () => {
    if (userErrorString === EMPTY_CREDENTIALS_ERROR) setUserErrorString('');
  };
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  // As on SignUpRegister: set by a sign-in attempt with an empty field, after
  // which each empty field reads red until it is filled. Kept separate from
  // the message, which clears on the first keystroke in either field.
  const [isFormErrored, setIsFormErrored] = React.useState(false);
  const isEmailErrored = isFormErrored && !email.trim();
  const isPasswordErrored = isFormErrored && !password;
  const errorAdornment = (show: boolean) =>
    show ? (
      <InputAdornment position="end">
        <FieldErrorIcon src={errorIcon} alt="" />
      </InputAdornment>
    ) : undefined;

  /*
   * signIn resolves the real User row and puts it in state; nothing here
   * fabricates profile fields. Navigation waits on it — it used to fire
   * unconditionally, so a rejected password still landed on the dashboard.
   */
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // The account behind these credentials never confirmed its code. Sending a
  // fresh one and handing over to the wizard's verify step finishes it there.
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(
    null,
  );
  const [isResending, setIsResending] = React.useState(false);
  const [resendError, setResendError] = React.useState(false);

  const handleSignIn = async () => {
    // Guards a second click landing before the disabled re-render.
    if (isSubmitting) return;
    // Flag the fields, then carry on: signIn still sets the message, so it
    // keeps one source.
    if (!email.trim() || !password) setIsFormErrored(true);
    setIsSubmitting(true);
    try {
      const result = await signIn({ email: email.trim(), password });
      if (result.status === 'ok') navigate('/dashboard');
      else if (result.status === 'unconfirmed') {
        setResendError(false);
        setUnverifiedEmail(email.trim());
      }
    } finally {
      // signIn reports a bad password by resolving 'error', not throwing, so
      // the reset has to cover every path.
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    if (!unverifiedEmail || isResending) return;
    setIsResending(true);
    setResendError(false);
    try {
      await apiClients.auth.awsResendConfirmationCode(unverifiedEmail);
      // The wizard seeds its state from this and clears it from history at
      // once, so the password isn't left in history.state.
      const handoff: SignUpVerifyHandoff = { email: unverifiedEmail, password };
      navigate('/signup/verify', { state: handoff });
    } catch (error) {
      console.error('Resend code error', error);
      setResendError(true);
    } finally {
      setIsResending(false);
    }
  };

  const googleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (credentialResponse) => {
      try {
        const token = credentialResponse.access_token;
        if (token) {
          // Best-effort: a failed name lookup must not stop the sign-in.
          const profile = await fetchGoogleProfile(token);
          if (profile) stashGoogleProfile(profile);
          await apiClients.auth.awsSignInFederated();
        } else {
          console.error('Google sign-in token is missing');
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
      }
    },
    onError: (err) => {
      console.error('Google Sign-In Failed', err);
    },
  });

  const handleGoogle = () => {
    googleLogin();
  };

  if (!isReady) return null;

  return (
    // Same shell as the sign-up steps: fills the body under the header, 140
    // from it (space14 + space4 — no single token; no stepper here, so it is
    // padding as on SignUpRole) and 125 off the bottom. Two sibling blocks —
    // heading and form — 48 apart, flex-start. No Continue: the Log in pill
    // is the only submit.
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        pt: `${theme.sizing.space14 + theme.sizing.space4}px`,
        pb: '125px',
      }}
    >
      <SignUpColumn
        screenSize={screenSize}
        // Wider than the other steps (640): "Welcome back to MicroCoach" is
        // ~729px at 52px Rubik 500 and the Spanish ~872px. The form below
        // stays capped at FORM_COLUMN.
        width={900}
        sx={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: `${theme.sizing.space8}px`,
        }}
      >
        <Box>
          <SignUpHeading>{t('login.welcome')}</SignUpHeading>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            // The column is 640 only so the heading fits on one line; the form
            // under it stays on the 500 Figma column.
            maxWidth: FORM_COLUMN,
            gap: `${theme.sizing.space5}px`,
          }}
        >
          <SignUpSubheading>{t('login.subtitle')}</SignUpSubheading>

          {/* Real Google OAuth now: popup, then the Hosted-UI redirect. Sign-in
              and sign-up share one entry point — Cognito issues the session
              either way, and validateUser decides which it was by whether a
              MicroCoachUser row exists for the cognitoId. */}
          <GoogleButton disableElevation onClick={handleGoogle}>
            <GoogleMark src={googleIcon} alt="" aria-hidden />
            {t('signup.google')}
          </GoogleButton>

          <OrDivider>{t('signup.or')}</OrDivider>

          {/* useFlexGap: Stack's default spacing is margin-top on each child. */}
          <Stack useFlexGap spacing={`${theme.sizing.space2}px`} sx={{ width: '100%' }}>
            <SignUpField
              type="email"
              isError={isEmailErrored}
              endAdornment={errorAdornment(isEmailErrored)}
              placeholder={t('signup.email')}
              inputProps={{
                'aria-label': t('signup.email'),
                'aria-invalid': isEmailErrored,
              }}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearEmptyFieldsError();
              }}
            />
            <SignUpField
              type={isShowPassword ? 'text' : 'password'}
              isError={isPasswordErrored}
              placeholder={t('signup.password')}
              inputProps={{
                'aria-label': t('signup.password'),
                'aria-invalid': isPasswordErrored,
              }}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearEmptyFieldsError();
              }}
              endAdornment={
                <InputAdornment position="end">
                  {isPasswordErrored && (
                    <FieldErrorIcon src={errorIcon} alt="" />
                  )}
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label={t(
                      isShowPassword
                        ? 'signup.hidePassword'
                        : 'signup.showPassword',
                    )}
                    onClick={() => setIsShowPassword((show) => !show)}
                    onMouseDown={suppressDefault}
                    onMouseUp={suppressDefault}
                    sx={{ color: 'designSystem.surface.placeholderGrey' }}
                  >
                    {isShowPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Stack>

          {/* Figma left-aligns this under the password field, where the rest of
              the column is centred. */}
          <Button
            variant="text"
            onClick={() => navigate('/password/reset')}
            sx={{
              alignSelf: 'flex-start',
              p: 0,
              ...theme.typography.rubikBody,
              color: 'designSystem.surface.darkBlue',
              textTransform: 'none',
            }}
          >
            {t('login.forgot')}
          </Button>

          {/* Sign-in failures used to be console-only, so a rejected password
              looked like a dead button. */}
          {userErrorString && (
            <Typography
              variant="rubikLabel"
              role="alert"
              sx={{
                color: 'designSystem.foreground.accentBlue',
                textAlign: 'center',
              }}
            >
              {userErrorString}
            </Typography>
          )}

          {/* Spinner replaces the label, as on SignUpVerify. SignUpPill has no
              Mui-disabled rule, so the colour is held here or MUI greys it out;
              the spinner inherits it. */}
          <SignUpPill
            disableElevation
            disabled={isSubmitting}
            onClick={handleSignIn}
            // Dropped while submitting: the spinner stands in for the whole label.
            startIcon={isSubmitting ? undefined : <img src={loginIconWhite} alt="" />}
            sx={{ '&.Mui-disabled': { color: 'designSystem.surface.white' } }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" aria-label={t('signup.login')} />
            ) : (
              t('signup.login')
            )}
          </SignUpPill>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: `${theme.sizing.space3}px`,
              width: '100%',
            }}
          >
            <Typography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.darkBlue' }}
            >
              {t('login.noAccount')}
            </Typography>
            <SignUpPillMuted
              disableElevation
              startIcon={<img src={signupIconWhite} alt="" />}
              onClick={() => navigate('/signup')}
            >
              {t('header.signup')}
            </SignUpPillMuted>
          </Box>
        </Box>
      </SignUpColumn>
      <VerifyAccountDialog
        email={unverifiedEmail}
        isSending={isResending}
        hasError={resendError}
        onCancel={() => setUnverifiedEmail(null)}
        onConfirm={handleSendCode}
      />
    </AppContentRow>
  );
}
