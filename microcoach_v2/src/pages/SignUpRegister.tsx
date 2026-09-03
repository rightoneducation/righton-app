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
import errorIcon from '../images/errorIcon.svg';
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
  FieldErrorIcon,
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
import { useMisconceptions } from '../hooks/useMisconceptions';

export default function SignUpRegister({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const state = useSignUpState();
  const dispatch = useSignUpDispatch();
  const { session } = useMisconceptions();
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

  const [isFormErrored, setIsFormErrored] = React.useState(false);
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

  /*
   * Decorative on purpose: `aria-invalid` on the input is what assistive tech
   * announces, so an icon repeating it would only add noise. It is there to
   * make the failing field findable at a glance.
   */
  const errorAdornment = (show: boolean) =>
    show ? (
      <InputAdornment position="end">
        <FieldErrorIcon src={errorIcon} alt="" />
      </InputAdornment>
    ) : undefined;

  /*
   * Ported from central_v2's SignUp: Continue always works, and a click on an
   * incomplete form reddens whatever is missing instead of the button going
   * dead. `showFieldErrors` is the load-bearing part — pairing the latch with
   * current validity means the red clears as the teacher types the fix, rather
   * than persisting until they click a second time.
   */
  const isFormValid = Boolean(
    state.firstName.trim() &&
    state.lastName.trim() &&
    state.email.trim() &&
    state.password &&
    approval === 'approved',
  );
  const showFieldErrors = isFormErrored && !isFormValid;

  /*
   * SET_VERIFIED is not cosmetic: both downstream steps guard on it, so
   * navigating without it bounces straight back to the start of the wizard.
   * Nothing else is seeded for a teacher — whatever names they typed carry
   * through, and the prototype invents no identity of its own.
   *
   * The two roles skip different amounts of the wizard. A teacher lands on
   * step 3 and still names their own classes; an admin goes straight to the
   * final screen, because an admin browses classes that already exist rather
   * than authoring any. That means the roster has to arrive with the sign-in
   * — the way a real callback would return it — or the final screen has an
   * empty dropdown and a CTA that can never enable.
   */
  const handleGoogle = () => {
    dispatch({ type: 'SET_VERIFIED' });

    if (state.role === 'ADMIN') {
      dispatch({
        type: 'SET_CLASSES',
        payload: session.classes.map((classOption) => classOption.name),
      });
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

        {/* Stubbed: the real popup is out of our system entirely, as the flow
            diagram marks it. Skipping it lands on step 3, not step 2 — Google
            has already proven the address, so the OTP screen has nothing left
            to do, and the diagram's step 2 is shown complete on a screen the
            teacher never sees. */}
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

        {/* Figma: 40 between the login row and Continue, where every other
            gap on this screen is 24. Additive on top of the column's gap
            rather than a negative margin. */}
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
