import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { SignUpStepProps } from '../lib/SignUpModels';
import { UserRole as Role } from '../api';
import AppContentRow from '../components/AppContentRow';
import {
  CARD_COLUMN,
  RoleCard,
  RoleIconTile,
  SignUpColumn,
  SignUpCta,
  SignUpHeading,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { TooltipStyled } from '../lib/styledcomponents/TooltipStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpRole({ screenSize, state, actions }: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { role } = state;
  const isReady = useAllReady(useI18nReady());

  if (!isReady) return null;

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{
        pt: `${theme.sizing.space12}px`,
        pb: `${theme.sizing.space12}px`,
      }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.rolePrompt')}</SignUpSubheading>

        <Stack
          spacing={`${theme.sizing.space4}px`}
          sx={{ width: '100%', alignItems: 'center' }}
        >
          <RoleCard
            isSelected={role === Role.TEACHER}
            aria-pressed={role === Role.TEACHER}
            onClick={() => actions.setRole(Role.TEACHER)}
          >
            <RoleIconTile>
              <PersonOutlineIcon />
            </RoleIconTile>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="headingMd"
                sx={{
                  display: 'block',
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {t('signup.roleTeacher')}
              </Typography>
              <Typography
                variant="rubikBody"
                sx={{
                  display: 'block',
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {t('signup.roleTeacherBody')}
              </Typography>
            </Box>
          </RoleCard>
          <TooltipStyled
            title='Coming Soon!'
            arrow
            placement="top"
          >
            <Box sx={{ width: '100%', maxWidth: CARD_COLUMN, display: 'flex' }}>
              <RoleCard
                disabled
                isSelected={role === Role.ADMIN}
                aria-pressed={role === Role.ADMIN}
                onClick={() => actions.setRole(Role.ADMIN)}
                style={{background: 'rgba(0,0,0,0.05)'}}
              >
                <RoleIconTile>
                  <ApartmentIcon />
                </RoleIconTile>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="headingMd"
                    sx={{
                      display: 'block',
                      color: 'designSystem.surface.atlanticNavy',
                    }}
                  >
                    {t('signup.roleAdmin')}
                  </Typography>
                  <Typography
                    variant="rubikBody"
                    sx={{
                      display: 'block',
                      color: 'designSystem.surface.atlanticNavy',
                    }}
                  >
                    {t('signup.roleAdminBody')}
                  </Typography>
                </Box>
              </RoleCard>
            </Box>
          </TooltipStyled>
        </Stack>

        {/* Both roles run the same wizard; they diverge only on the final
            screen, where an admin picks a class from a dropdown and lands on
            cross-teacher data rather than an upload. */}
        <SignUpCta
          disableElevation
          disabled={!role}
          onClick={() => navigate('/signup/register')}
          sx={{ mt: `${theme.sizing.space12}px` }}
        >
          {t('signup.continue')}
        </SignUpCta>
      </SignUpColumn>
    </AppContentRow>
  );
}
