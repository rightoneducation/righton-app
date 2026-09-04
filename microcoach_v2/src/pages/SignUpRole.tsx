import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import {
  SignUpStepProps,
  SignUpRole as Role,
} from '../lib/SignUpModels';
import AppContentRow from '../components/AppContentRow';
import {
  RoleCard,
  RoleIconTile,
  SignUpColumn,
  SignUpCta,
  SignUpHeading,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

const ROLES: {
  id: Role;
  titleKey: string;
  bodyKey: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'TEACHER',
    titleKey: 'signup.roleTeacher',
    bodyKey: 'signup.roleTeacherBody',
    icon: <PersonOutlineIcon />,
  },
  {
    id: 'ADMIN',
    titleKey: 'signup.roleAdmin',
    bodyKey: 'signup.roleAdminBody',
    icon: <ApartmentIcon />,
  },
];

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
          {ROLES.map((option) => (
            <RoleCard
              key={option.id}
              isSelected={role === option.id}
              aria-pressed={role === option.id}
              onClick={() => actions.setRole(option.id)}
            >
              <RoleIconTile>{option.icon}</RoleIconTile>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="headingMd"
                  sx={{
                    display: 'block',
                    color: 'designSystem.surface.atlanticNavy',
                  }}
                >
                  {t(option.titleKey)}
                </Typography>
                <Typography
                  variant="rubikBody"
                  sx={{
                    display: 'block',
                    color: 'designSystem.surface.atlanticNavy',
                  }}
                >
                  {t(option.bodyKey)}
                </Typography>
              </Box>
            </RoleCard>
          ))}
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
