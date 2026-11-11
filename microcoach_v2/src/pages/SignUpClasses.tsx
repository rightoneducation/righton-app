import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { SignUpStepProps, namedClasses } from '../lib/SignUpModels';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import {
  FORM_COLUMN,
  AddClassChip,
  SignUpColumn,
  SignUpCta,
  SignUpField,
  SignUpHeading,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpClasses({ screenSize, state, actions }: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const isReady = useAllReady(useI18nReady());

  if (!state.isVerified) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const canContinue = namedClasses(state).length > 0;

  return (
    // Same shell as SignUpRegister: fills the body under the header and sits
    // 125 off the bottom; the 140 above the heading is the stepper's own row.
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
            <SignUpStepper current={3} />
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
          <SignUpSubheading>{t('signup.classesTitle')}</SignUpSubheading>

          <Stack useFlexGap spacing={`${theme.sizing.space4}px`} sx={{ width: '100%' }}>
            {state.classes.map((name, index) => (
              <Stack
                // Positional: the rows are an ordered list of free text, so the
                // index is the only stable identity while they are being typed.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                direction="row"
                alignItems="center"
                useFlexGap
                spacing={`${theme.sizing.space1}px`}
              >
                <SignUpField
                  placeholder={t('signup.classPlaceholder')}
                  inputProps={{ 'aria-label': t('signup.classPlaceholder') }}
                  value={name}
                  onChange={(event) =>
                    actions.setClass(index, event.target.value)
                  }
                />
                {/* The frame never draws a second row, so it cannot show how one
                    is removed. Kept off the first row so there is always at
                    least one field to type into. */}
                {state.classes.length > 1 && (
                  <IconButton
                    size="small"
                    aria-label={t('signup.removeClass')}
                    onClick={() =>
                      actions.removeClass(index)
                    }
                    sx={{ color: 'designSystem.surface.ashyGray' }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>

          <AddClassChip
            disableElevation
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => actions.addClass()}
          >
            {t('signup.addClass')}
          </AddClassChip>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SignUpCta
            disableElevation
            disabled={!canContinue}
            onClick={() => navigate('/signup/select')}
          >
            {t('signup.continue')}
          </SignUpCta>
        </Box>
      </SignUpColumn>
    </AppContentRow>
  );
}
