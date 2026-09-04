import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { SignUpStepProps, namedClasses } from '../lib/SignUpModels';
import AppContentRow from '../components/AppContentRow';
import SignUpStepper from '../components/SignUpStepper';
import {
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
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpStepper current={3} />
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.classesTitle')}</SignUpSubheading>

        <Stack spacing={`${theme.sizing.space4}px`} sx={{ width: '100%' }}>
          {state.classes.map((name, index) => (
            <Stack
              // Positional: the rows are an ordered list of free text, so the
              // index is the only stable identity while they are being typed.
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              direction="row"
              alignItems="center"
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

        <SignUpCta
          disableElevation
          disabled={!canContinue}
          onClick={() => navigate('/signup/select')}
          sx={{ mt: `${theme.sizing.space12}px` }}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
