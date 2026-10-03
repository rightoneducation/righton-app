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
import { UserProps } from '../hooks/useUserState';
import {
  GoogleButton,
  GoogleMark,
  OrDivider,
  SignUpColumn,
  SignUpCta,
  SignUpField,
  SignUpHeading,
  SignUpPill,
  SignUpPillMuted,
  SignUpSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import googleIcon from '../images/googleicon.svg';

interface LoginProps extends ScreenSizeProps, UserProps {
  apiClients: IAPIClients;
}

export default function Login({ apiClients, screenSize, user }: LoginProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { signIn, userErrorString } = user;
  const isReady = useAllReady(useI18nReady());

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  /*
   * signIn resolves the real User row and puts it in state; nothing here
   * fabricates profile fields. Navigation waits on it — it used to fire
   * unconditionally, so a rejected password still landed on the dashboard.
   */
  // Which of the two sign-in buttons is waiting, so the spinner shows in the
  // one that was pressed. null when idle.
  const [submittingFrom, setSubmittingFrom] = React.useState<
    'pill' | 'cta' | null
  >(null);
  const isSubmitting = submittingFrom !== null;

  const handleSignIn = async (source: 'pill' | 'cta') => {
    // Guards a second click landing before the disabled re-render.
    if (isSubmitting) return;
    setSubmittingFrom(source);
    try {
      const profile = await signIn({ email: email.trim(), password });
      if (profile) navigate('/dashboard');
    } finally {
      // signIn reports a bad password by resolving null, not throwing, so the
      // reset has to cover every path.
      setSubmittingFrom(null);
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
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space12}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpHeading>{t('login.welcome')}</SignUpHeading>
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

        <Stack spacing={`${theme.sizing.space2}px`} sx={{ width: '100%' }}>
          <SignUpField
            type="email"
            placeholder={t('signup.email')}
            inputProps={{ 'aria-label': t('signup.email') }}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <SignUpField
            type={isShowPassword ? 'text' : 'password'}
            placeholder={t('signup.password')}
            inputProps={{ 'aria-label': t('signup.password') }}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
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
            mt: `-${theme.sizing.space0}px`,
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
          onClick={() => handleSignIn('pill')}
          sx={{ '&.Mui-disabled': { color: 'designSystem.surface.white' } }}
        >
          {submittingFrom === 'pill' ? (
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
            mt: `-${theme.sizing.space0}px`,
          }}
        >
          <Typography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.darkBlue' }}
          >
            {t('login.noAccount')}
          </Typography>
          <SignUpPillMuted disableElevation onClick={() => navigate('/signup')}>
            {t('header.signup')}
          </SignUpPillMuted>
        </Box>

        {/* color="inherit": the spinner takes SignUpCta's disabled label
            colour, which reads on its grey disabled fill where white would
            vanish. */}
        <SignUpCta
          disableElevation
          disabled={isSubmitting}
          onClick={() => handleSignIn('cta')}
          sx={{ mt: `${theme.sizing.space5}px` }}
        >
          {submittingFrom === 'cta' ? (
            <CircularProgress size={24} color="inherit" aria-label={t('signup.continue')} />
          ) : (
            t('signup.continue')
          )}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
