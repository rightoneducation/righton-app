import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
    // Fills the body under the header (BodyContainer is a growing flex
    // column) so the column below has height for space-between to act on.
    // 140 from the header has no single token, so it is space14 + space4.
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        pt: `${theme.sizing.space14 + theme.sizing.space4}px`,
        pb: '125px',
      }}
    >
      {/* Widened from the 500 form column: the 52px h1 runs ~560px and
          wrapped "MicroCoach" onto a second line. Cards and CTA keep their
          own max-widths, so they stay centred at their Figma sizes. */}
      <SignUpColumn
        screenSize={screenSize}
        width={640}
        sx={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            gap: `${theme.sizing.space8}px`,
          }}
        >
          <Box>
            <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: `${theme.sizing.space5}px`,
            }}
          >
            <SignUpSubheading>{t('signup.rolePrompt')}</SignUpSubheading>
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
          </Box>
        </Box>

        {/* Both roles run the same wizard; they diverge only on the final
            screen, where an admin picks a class from a dropdown and lands on
            cross-teacher data rather than an upload. */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SignUpCta
            disableElevation
            disabled={!role}
            onClick={() => navigate('/signup/register')}
          >
            {t('signup.continue')}
          </SignUpCta>
        </Box>
      </SignUpColumn>
    </AppContentRow>
  );
}
