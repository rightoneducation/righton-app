import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import VerificationCodeInput from '../components/VerificationCodeInput';
import { CODE_LENGTH } from '../lib/SignUpModels';
import {
  FORM_COLUMN,
  FieldRow,
  PasswordRulesPanel,
  ResetButton,
  SignUpColumn,
  SignUpCta,
  SignUpField,
  SignUpHeading,
  SignUpPill,
  SignUpSubheading,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

/**
 * Password reset, as two steps on one route.
 *
 * The frames give no separate URLs for them — all three are drawn as the same
 * screen — so the step lives in local state rather than the router.
 *
 * Frame 3 keeps the verify heading and its instruction above the password
 * fields. That reads as design drift, but it is rendered as drawn rather than
 * silently reworded.
 */

const RULE_KEYS = ['reset.ruleLength', 'reset.ruleLetter', 'reset.ruleNumber'];

interface ResetPasswordProps extends ScreenSizeProps {
  /**
   * Reached from Account Settings rather than from Login. The steps are the
   * same either way — the frames draw only the one flow — but the wizard
   * framing and the exit are not: someone already signed in is not part-way
   * through sign-up, and sending them to /login afterwards would strand them
   * on a login screen they are already past.
   */
  isInSession?: boolean;
}

export default function ResetPassword({
  screenSize,
  isInSession = false,
}: ResetPasswordProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isReady = useAllReady(useI18nReady());

  const returnTo = isInSession ? '/profile' : '/login';
  // replace: the flow is finished, so Back should not re-enter it.
  const leaveFlow = () => navigate(returnTo, { replace: true });

  const [step, setStep] = React.useState<'verify' | 'password'>('verify');
  const [code, setCode] = React.useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  if (!isReady) return null;

  const goToPassword = () => setStep('password');

  return (
    // Same shell as the sign-up steps: fills the body under the header and
    // sits 125 off the bottom; the 140 above the heading is the stepper's row.
    // Three sibling blocks — heading, form, Continue — 48 apart, flex-start.
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
          {/* 140 tall (space14 + space4 — no single token) and centred, so the
              heading lands 140 below the header. The row stays when the
              stepper is hidden, so both variants share that position. */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: `${theme.sizing.space14 + theme.sizing.space4}px`,
            }}
          >
            {/* Wizard furniture: the stepper and the "Step 2" subheading only
                make sense to someone actually in sign-up. */}
            {!isInSession && <SignUpStepper current={2} />}
          </Box>
          <SignUpHeading>
            {t(isInSession ? 'reset.title' : 'signup.welcome')}
          </SignUpHeading>
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
          {!isInSession && (
            <SignUpSubheading>{t('signup.verifyTitle')}</SignUpSubheading>
          )}

          <Typography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.darkBlue', textAlign: 'center' }}
          >
            {t('signup.verifyBody')}
          </Typography>

          {step === 'verify' ? (
            <>
              <VerificationCodeInput
                autoFocus
                code={code}
                onCodeChange={setCode}
              />

              <Button
                variant="text"
                onClick={() => setCode(Array(CODE_LENGTH).fill(''))}
                sx={{
                  ...theme.typography.rubikBody,
                  color: 'designSystem.surface.darkBlue',
                  textTransform: 'none',
                  textDecoration: 'underline',
                }}
              >
                {t('signup.resend')}
              </Button>

              <SignUpPill disableElevation onClick={goToPassword}>
                {t('signup.verify')}
              </SignUpPill>
            </>
          ) : (
            <>
              {/* Figma pairs these at 242 each, like the first/last name row,
                  rather than the 500-wide single fields used elsewhere. */}
              <FieldRow screenSize={screenSize}>
                <SignUpField
                  type="password"
                  placeholder={t('reset.newPassword')}
                  inputProps={{ 'aria-label': t('reset.newPassword') }}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <SignUpField
                  type="password"
                  placeholder={t('reset.confirmPassword')}
                  inputProps={{ 'aria-label': t('reset.confirmPassword') }}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </FieldRow>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: `${theme.sizing.space3}px`,
                  width: '100%',
                  flexWrap: 'wrap',
                }}
              >
                <PasswordRulesPanel>
                  <Typography variant="rubikBody" sx={{ display: 'block' }}>
                    {t('reset.rulesTitle')}
                  </Typography>
                  <Stack component="ul" sx={{ m: 0, pl: 2 }}>
                    {RULE_KEYS.map((key) => (
                      <Typography
                        key={key}
                        component="li"
                        variant="rubikBody"
                        sx={{ display: 'list-item' }}
                      >
                        {t(key)}
                      </Typography>
                    ))}
                  </Stack>
                </PasswordRulesPanel>

                <ResetButton disableElevation onClick={leaveFlow}>
                  {t('reset.reset')}
                </ResetButton>
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SignUpCta
            disableElevation
            onClick={step === 'verify' ? goToPassword : leaveFlow}
          >
            {t('signup.continue')}
          </SignUpCta>
        </Box>
      </SignUpColumn>
    </AppContentRow>
  );
}
