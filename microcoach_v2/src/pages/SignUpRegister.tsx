import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import googleIcon from '../images/googleicon.svg';
import checkEmailApproval from '../lib/mocks/approvalCheck';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import { SignUpField as Field } from '../lib/context/SignUpContext';
import {
  useSignUpDispatch,
  useSignUpState,
} from '../hooks/context/useSignUpContext';
import {
  FieldRow,
  GoogleButton,
  GoogleMark,
  OrDivider,
  SignUpColumn,
  SignUpCta,
  SignUpField,
  SignUpHeading,
  SignUpPill,
  SignUpSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpRegister({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const state = useSignUpState();
  const dispatch = useSignUpDispatch();
  const isReady = useAllReady(useI18nReady());

  // Ported from central_v2's SignUp: the mouse handlers suppress the default
  // so pressing the reveal control cannot steal focus from the field.
  /*
   * Only vetted teachers may create a profile, so the address is checked
   * before the wizard will continue. Local rather than in SignUpContext:
   * re-checking on a return to this step is correct, not a bug.
   */
  type ApprovalStatus = 'idle' | 'checking' | 'approved' | 'rejected';
  const [approval, setApproval] = React.useState<ApprovalStatus>('idle');
  const latestChecked = React.useRef('');

  const runApprovalCheck = async (value: string) => {
    const email = value.trim();
    // Nothing to check against yet — leave the row quiet.
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

  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setIsShowPassword((show) => !show);
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  // Reached without choosing a role — send them back rather than render a
  // wizard with nothing behind it.
  if (!state.role) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const setField = (field: Field) => (value: string) =>
    dispatch({ type: 'SET_FIELD', payload: { field, value } });

  const canContinue = Boolean(
    state.firstName.trim() &&
    state.lastName.trim() &&
    state.email.trim() &&
    state.password,
  );

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpStepper current={1} />
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.registerTitle')}</SignUpSubheading>

        {/* Mocked: the prototype has no federated sign-in, so this advances
            the wizard exactly as the form does. */}
        <GoogleButton
          disableElevation
          onClick={() => navigate('/signup/verify')}
        >
          <GoogleMark src={googleIcon} alt="" aria-hidden />
          {t('signup.google')}
        </GoogleButton>

        <OrDivider>{t('signup.or')}</OrDivider>

        <Stack spacing={`${theme.sizing.space2}px`} sx={{ width: '100%' }}>
          <FieldRow screenSize={screenSize}>
            <SignUpField
              placeholder={t('signup.firstName')}
              inputProps={{ 'aria-label': t('signup.firstName') }}
              value={state.firstName}
              onChange={(event) => setField('firstName')(event.target.value)}
            />
            <SignUpField
              placeholder={t('signup.lastName')}
              inputProps={{ 'aria-label': t('signup.lastName') }}
              value={state.lastName}
              onChange={(event) => setField('lastName')(event.target.value)}
            />
          </FieldRow>

          <SignUpField
            type="email"
            isActive={approval === 'checking'}
            placeholder={t('signup.email')}
            inputProps={{ 'aria-label': t('signup.email') }}
            value={state.email}
            onChange={(event) => {
              setField('email')(event.target.value);
              // A verdict for the old address is meaningless once it changes.
              if (approval !== 'idle') setApproval('idle');
            }}
            onBlur={(event) => runApprovalCheck(event.target.value)}
          />

          {/* In flow rather than overlaid, so the password field reflows down
              as the frames draw it. Copy and colour are the frames' own — the
              outline carries any error, the message stays accentBlue. */}
          {approval !== 'idle' && approval !== 'approved' && (
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
            placeholder={t('signup.password')}
            inputProps={{ 'aria-label': t('signup.password') }}
            value={state.password}
            onChange={(event) => setField('password')(event.target.value)}
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
          <SignUpPill disableElevation onClick={() => navigate('/login')}>
            {t('signup.login')}
          </SignUpPill>
        </Box>

        <SignUpCta
          disableElevation
          disabled={!canContinue}
          onClick={() => navigate('/signup/verify')}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
