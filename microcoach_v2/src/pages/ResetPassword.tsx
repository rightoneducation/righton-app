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
import { CODE_LENGTH } from '../lib/context/SignUpContext';
import {
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

export default function ResetPassword({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isReady = useAllReady(useI18nReady());

  const [step, setStep] = React.useState<'verify' | 'password'>('verify');
  const [code, setCode] = React.useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  if (!isReady) return null;

  const goToPassword = () => setStep('password');

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

              <ResetButton disableElevation onClick={() => navigate('/login')}>
                {t('reset.reset')}
              </ResetButton>
            </Box>
          </>
        )}

        <SignUpCta
          disableElevation
          onClick={step === 'verify' ? goToPassword : () => navigate('/login')}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
