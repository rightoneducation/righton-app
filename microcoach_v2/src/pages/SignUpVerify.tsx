import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import { CODE_LENGTH } from '../lib/context/SignUpContext';
import {
  useSignUpDispatch,
  useSignUpState,
} from '../hooks/context/useSignUpContext';
import {
  CodeBox,
  CodeRow,
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

  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [didResend, setDidResend] = React.useState(false);

  if (!state.role) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const digits = state.code.padEnd(CODE_LENGTH).slice(0, CODE_LENGTH).split('');

  const writeDigit = (index: number, raw: string) => {
    // Keep only the last typed character, so replacing a filled box works
    // without the caret dance a maxLength alone would need.
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? digit || ' ' : d));
    dispatch({
      type: 'SET_FIELD',
      payload: { field: 'code', value: next.join('').trimEnd() },
    });
    if (digit && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown =
    (index: number) =>
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Backspace on an empty box walks back, which is what every code input
      // does and what a tester will expect.
      if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    };

  const isComplete = state.code.trim().length === CODE_LENGTH;

  const handleVerify = () => {
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

        <CodeRow>
          {digits.map((digit, index) => (
            <CodeBox
              // Positional by nature: a digit box has no identity but its slot.
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              isFilled={Boolean(digit.trim())}
              value={digit.trim()}
              inputRef={(el: HTMLInputElement | null) => {
                inputs.current[index] = el;
              }}
              inputProps={{
                inputMode: 'numeric',
                'aria-label': t('signup.verifyDigit', { number: index + 1 }),
              }}
              onChange={(event) => writeDigit(index, event.target.value)}
              onKeyDown={handleKeyDown(index)}
            />
          ))}
        </CodeRow>

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

        <SignUpPill
          disableElevation
          disabled={!isComplete}
          onClick={handleVerify}
        >
          {t('signup.verify')}
        </SignUpPill>
      </SignUpColumn>
    </AppContentRow>
  );
}
