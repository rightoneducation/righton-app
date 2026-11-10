import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useGoogleLogin } from '@react-oauth/google';
import {
  fetchGoogleProfile,
  stashGoogleProfile,
} from '../lib/googleProfileStash';
import {
  SignUpStepProps,
  SignUpField as Field,
} from '../lib/SignUpModels';
import googleIcon from '../images/googleicon.svg';
import errorIcon from '../images/errorIcon.svg';
import loginIconWhite from '../images/loginIconWhite.svg';
import checkEmailApproval from '../lib/mocks/approvalCheck';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import {
  FORM_COLUMN,
  FieldRow,
  GoogleButton,
  GoogleMark,
  FieldErrorIcon,
  OrDivider,
  SignUpColumn,
  SignUpCta,
  SignUpField,
  SignUpHeading,
  SignUpPill,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import VerifyAccountDialog from '../components/VerifyAccountDialog';

export default function SignUpRegister({ apiClients, screenSize, state, actions }: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const isReady = useAllReady(useI18nReady());

  // used for Admin account creation
  // all new accounts checked against a preveted list
  // currently stubbed out until admin accounts resolved (defaulted state to approved)
  type ApprovalStatus = 'idle' | 'checking' | 'approved' | 'rejected';
  const [approval, setApproval] = React.useState<ApprovalStatus>('approved');
  const latestChecked = React.useRef('');

  const runApprovalCheck = async (value: string) => {
    const email = value.trim();
    if (!email.includes('@')) {
      latestChecked.current = '';
      setApproval('idle');
      return;
    }
    if (email === latestChecked.current) return;

    latestChecked.current = email;
    setApproval('checking');
    const result = await checkEmailApproval(email);
    // A slow answer for a since-corrected address must not overwrite the
    // newer one; without this the stale verdict wins whenever it lands last.
    if (latestChecked.current !== email) return;
    setApproval(result.isApproved ? 'approved' : 'rejected');
  };

  const [isFormErrored, setIsFormErrored] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Why Cognito or the PreSignUp trigger refused the signup, e.g. the email is
  // already registered with Google. awsSignUp has already reduced it to the
  // human-readable half of `CODE|message`.
  const [signUpError, setSignUpError] = React.useState('');
  // Set when the email belongs to an account that never confirmed its code;
  // the dialog offers a fresh one rather than a dead-end "exists" message.
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(
    null,
  );
  const [isResending, setIsResending] = React.useState(false);
  const [resendError, setResendError] = React.useState(false);
  const handleClickShowPassword = () => setIsShowPassword((show) => !show);
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  /*
   * Ported from central_v2 (SignUp.tsx). Two Google OAuth flows run back to
   * back: this popup, then awsSignInFederated's full-page redirect to the
   * Cognito Hosted UI, which runs Google again with the credentials stored on
   * the Cognito IdP. The popup's access_token is only a gate — Cognito issues
   * the session we actually use — so it is checked but not sent anywhere.
   *
   * Nothing after awsSignInFederated runs: the page navigates away. The wizard's
   * useState dies with it, which is why no setVerified()/navigate() here. The
   * return leg lands on /auth, and validateUser resolves the session from there.
   *
   * Unlike central_v2 we DO use the popup's token: it reads the name straight
   * from Google and stashes it for AuthCallback, because Cognito's IdP mapping
   * doesn't forward given_name/family_name. See lib/googleProfileStash.
   */
  const googleLogin = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (credentialResponse) => {
      try {
        const token = credentialResponse.access_token;
        if (token) {
          // Best-effort: a failed name lookup must not stop the signup, so this
          // never throws and the redirect runs either way.
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

  if (!state.role) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const setField = (field: Field) => (value: string) =>
    actions.setField(field, value);

  const errorAdornment = (show: boolean) =>
    show ? (
      <InputAdornment position="end">
        <FieldErrorIcon src={errorIcon} alt="" />
      </InputAdornment>
    ) : undefined;

  const isFormValid = Boolean(
    state.firstName.trim() &&
    state.lastName.trim() &&
    state.email.trim() &&
    state.password &&
    approval === 'approved',
  );
  const showFieldErrors = isFormErrored && !isFormValid;

  const handleGoogle = () => {
    googleLogin();
  };

  /*
   * Cognito refuses a second signUp for the same email whether or not the
   * first one confirmed. Signing in with the typed password tells the two
   * apart without saying whether an email is registered: only someone holding
   * the password learns the account is unverified.
   */
  const handleExistingAccount = async () => {
    try {
      const result = await apiClients.auth.awsSignIn(state.email, state.password);
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setResendError(false);
        setUnverifiedEmail(state.email);
        return;
      }
      // Confirmed account and the right password: this is a sign-up page, so
      // undo the sign-in and point them at Log in instead.
      if (result.isSignedIn) await apiClients.auth.awsSignOut();
    } catch (error) {
      // Wrong password (or an unconfirmed account under a different one —
      // indistinguishable here). Log in is the way forward either way.
      console.error('Existing-account check', error);
    }
    setSignUpError(t('signup.accountExists'));
  };

  const handleContinue = async () => {
    // Guards a second click landing before the disabled re-render.
    if (isSubmitting) return;
    // Validate before the flag, so an invalid click doesn't flash the spinner.
    if (!isFormValid) {
      setIsFormErrored(true);
      return;
    }
    setIsFormErrored(false);
    setSignUpError('');
    setIsSubmitting(true);
    try{
      await apiClients.user.signUpSendConfirmationCode(
        state
      );
      navigate('/signup/verify');
    } catch (error) {
      console.error('Sign Up Error', error);
      if ((error as Error).name === 'UsernameExistsException') {
        await handleExistingAccount();
      } else {
        setSignUpError((error as Error).message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    if (!unverifiedEmail || isResending) return;
    setIsResending(true);
    setResendError(false);
    try {
      await apiClients.auth.awsResendConfirmationCode(unverifiedEmail);
      // The wizard already holds the names and password just typed.
      navigate('/signup/verify');
    } catch (error) {
      console.error('Resend code error', error);
      setResendError(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    // Same shell as SignUpRole: fills the body under the header and sits 125
    // off the bottom. The 140 above the heading is the stepper's own row
    // rather than padding, so the stepper centres in that space. Unlike
    // SignUpRole, the CTA sits straight under the form (flex-start).
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        pb: '125px',
      }}
    >
      <SignUpColumn
        screenSize={screenSize}
        width={640}
        sx={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: `${theme.sizing.space8}px`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* 140 tall (space14 + space4 — no single token) and centred, so
              the heading lands 140 below the header whatever the stepper's
              own height. */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: `${theme.sizing.space14 + theme.sizing.space4}px`,
            }}
          >
            <SignUpStepper current={1} />
          </Box>
          <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
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
          <SignUpSubheading>{t('signup.registerTitle')}</SignUpSubheading>
          <GoogleButton disableElevation onClick={handleGoogle}>
            <GoogleMark src={googleIcon} alt="" aria-hidden />
            {t('signup.google')}
          </GoogleButton>

          <OrDivider>{t('signup.or')}</OrDivider>

          {/* useFlexGap: Stack's default spacing is margin-top on each child. */}
          <Stack useFlexGap spacing={`${theme.sizing.space2}px`} sx={{ width: '100%' }}>
            <FieldRow screenSize={screenSize}>
              <SignUpField
                isError={showFieldErrors && !state.firstName.trim()}
                endAdornment={errorAdornment(
                  showFieldErrors && !state.firstName.trim(),
                )}
                placeholder={t('signup.firstName')}
                inputProps={{
                  'aria-label': t('signup.firstName'),
                  'aria-invalid': showFieldErrors && !state.firstName.trim(),
                }}
                value={state.firstName}
                onChange={(event) => setField('firstName')(event.target.value)}
              />
              <SignUpField
                isError={showFieldErrors && !state.lastName.trim()}
                endAdornment={errorAdornment(
                  showFieldErrors && !state.lastName.trim(),
                )}
                placeholder={t('signup.lastName')}
                inputProps={{
                  'aria-label': t('signup.lastName'),
                  'aria-invalid': showFieldErrors && !state.lastName.trim(),
                }}
                value={state.lastName}
                onChange={(event) => setField('lastName')(event.target.value)}
              />
            </FieldRow>

            <SignUpField
              type="email"
              isActive={approval === 'checking'}
              // Red for an empty address and for one the vetted list refused —
              // the message underneath already tells the two apart.
              isError={
                showFieldErrors &&
                (!state.email.trim() || approval !== 'approved')
              }
              endAdornment={errorAdornment(
                showFieldErrors &&
                  (!state.email.trim() || approval !== 'approved'),
              )}
              placeholder={t('signup.email')}
              inputProps={{
                'aria-label': t('signup.email'),
                'aria-invalid':
                  showFieldErrors &&
                  (!state.email.trim() || approval !== 'approved'),
              }}
              value={state.email}
              onChange={(event) => {
                setField('email')(event.target.value);
                // A verdict for the old address is meaningless once it changes.
                // if (approval !== 'idle') setApproval('idle'); 
              }}
              // onBlur={(event) => 
              //   runApprovalCheck(event.target.value)
              // }
            />

            {/* In flow rather than overlaid, so the password field reflows down
                as the frames draw it. Copy and colour are the frames' own — the
                outline carries any error, the message stays accentBlue. */}
            {approval !== 'approved' && (
              <Typography
                variant="rubikLabel"
                role="status"
                sx={{
                  fontWeight: 600,
                  color: 'designSystem.foreground.accentBlue',
                  textAlign: 'center',
                }}
              >
                {t(
                  approval === 'checking'
                    ? 'signup.checkingEmail'
                    : 'signup.emailNotApproved',
                )}
              </Typography>
            )}
            <SignUpField
              type={isShowPassword ? 'text' : 'password'}
              isError={showFieldErrors && !state.password}
              placeholder={t('signup.password')}
              inputProps={{
                'aria-label': t('signup.password'),
                'aria-invalid': showFieldErrors && !state.password,
              }}
              value={state.password}
              onChange={(event) => setField('password')(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  {showFieldErrors && !state.password && (
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
                    onClick={handleClickShowPassword}
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

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: `${theme.sizing.space3}px`,
              width: '100%',
            }}
          >
            <Typography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.darkBlue' }}
            >
              {t('signup.haveAccount')}
            </Typography>
            <SignUpPill
              disableElevation
              startIcon={<img src={loginIconWhite} alt="" />}
              onClick={() => navigate('/login')}
            >
              {t('signup.login')}
            </SignUpPill>
          </Box>
          {/* Same treatment as Login's sign-in error. */}
          {signUpError && (
            <Typography
              variant="rubikLabel"
              role="alert"
              sx={{
                color: 'designSystem.foreground.accentBlue',
                textAlign: 'center',
              }}
            >
              {signUpError}
            </Typography>
          )}
        </Box>

        {/* color="inherit": the spinner takes SignUpCta's disabled label
            colour, which reads on its grey disabled fill where white would
            vanish. */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SignUpCta
            disableElevation
            disabled={isSubmitting}
            onClick={handleContinue}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" aria-label={t('signup.continue')} />
            ) : (
              t('signup.continue')
            )}
          </SignUpCta>
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
