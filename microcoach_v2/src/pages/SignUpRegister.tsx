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
import {
  SignUpStepProps,
  SignUpField as Field,
} from '../lib/SignUpModels';
import googleIcon from '../images/googleicon.svg';
import errorIcon from '../images/errorIcon.svg';
import checkEmailApproval from '../lib/mocks/approvalCheck';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import {
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
import { useMisconceptions } from '../hooks/useMisconceptions';

export default function SignUpRegister({ screenSize, state, actions }: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const { session } = useMisconceptions();
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
  const handleClickShowPassword = () => setIsShowPassword((show) => !show);
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

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
    actions.setVerified();
    if (state.role === 'ADMIN') {
      actions.setClasses(session.classes.map((classOption) => classOption.name));
      navigate('/signup/select');
      return;
    }
    navigate('/signup/classes');
  };

  const handleContinue = () => {
    if (!isFormValid) {
      setIsFormErrored(true);
      return;
    }
    setIsFormErrored(false);
    navigate('/signup/verify');
  };

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpStepper current={1} />
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.registerTitle')}</SignUpSubheading>
        <GoogleButton disableElevation onClick={handleGoogle}>
          <GoogleMark src={googleIcon} alt="" aria-hidden />
          {t('signup.google')}
        </GoogleButton>

        <OrDivider>{t('signup.or')}</OrDivider>

        <Stack spacing={`${theme.sizing.space2}px`} sx={{ width: '100%' }}>
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
          <SignUpPill disableElevation onClick={() => navigate('/login')}>
            {t('signup.login')}
          </SignUpPill>
        </Box>
        <SignUpCta
          disableElevation
          onClick={handleContinue}
          sx={{ mt: `${theme.sizing.space3}px` }}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
