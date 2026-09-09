import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useGoogleLogin } from '@react-oauth/google';
import {
  fetchGoogleProfile,
  stashGoogleProfile,
} from '../lib/googleProfileStash';
import { IAPIClients, UserRole } from '../api';
import AppContentRow from '../components/AppContentRow';
import { UserProps } from '../hooks/useUserState';
import { useMisconceptions } from '../hooks/useMisconceptions';
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
  const { signIn } = user;
  const { session } = useMisconceptions();
  const isReady = useAllReady(useI18nReady());

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  /*
   * Stands in for the role the API will return on a real sign-in. Two test
   * accounts on the domain approvalCheck.ts already approves, so the same
   * credentials work through sign-up too:
   *   teacher@school.com -> TEACHER
   *   admin@school.com   -> ADMIN
   */
  const roleForEmail = (value: string) =>
    value.trim().toLowerCase().startsWith('admin@')
      ? UserRole.ADMIN
      : UserRole.TEACHER;

  /*
   * Mocked, like the rest of the prototype: no credentials are checked. The
   * frame draws both a Login pill and a Continue CTA, so both sign in — the
   * alternative would be leaving one of them inert, which reads as broken.
   */
  const handleSignIn = () => {
    signIn({
      email: email.trim() || session.teacher.email,
      teacherName: session.teacher.displayName,
      role: roleForEmail(email),
      classes: session.classes.map((option) => option.name),
    });
    navigate('/dashboard');
  };

  /*
   * Same flow as the sign-up page (see SignUpRegister): the popup gates, then
   * awsSignInFederated redirects to the Cognito Hosted UI. Nothing after it
   * runs — the page navigates away and comes back to /auth.
   *
   * The name is stashed here too, not just on the signup page: Cognito decides
   * signup-vs-signin by whether a MicroCoachUser row exists, so a first-timer
   * who starts from Login lands in the same row-creating path.
   */
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

        <SignUpPill disableElevation onClick={handleSignIn}>
          {t('signup.login')}
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

        <SignUpCta
          disableElevation
          onClick={handleSignIn}
          sx={{ mt: `${theme.sizing.space5}px` }}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
