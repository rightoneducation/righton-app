import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Link, { LinkProps } from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContentRow from './ContentRow';
import { ScreenSize, UserStatusType } from '../lib/MicroCoachModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';

interface HeaderProps {
  screenSize: ScreenSize;
}

// styled() erases MUI's polymorphic `component` prop, so re-declare it here to
// keep rendering these as router Links.
type RouterExtras = { component?: React.ElementType; to?: string };

// Figma: navy bar, 134 tall on all three frames.
const HeaderBar = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  width: '100%',
  height: theme.sizing.headerHeight,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.designSystem.background.navyBlue,
}));

// Figma: 132x54, rx 27 — a pill, so the radius tracks the height.
const LoginButton = styled(Button)<ButtonProps & RouterExtras>(({ theme }) => ({
  minWidth: 132,
  height: 54,
  padding: `0 ${theme.sizing.space5}px`,
  borderRadius: 27,
  backgroundColor: theme.palette.designSystem.surface.white,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.skyBlue,
  },
}));

const NavLink = styled(Link)<LinkProps & RouterExtras>(({ theme }) => ({
  ...theme.typography.mediumLabel,
  color: theme.palette.designSystem.surface.white,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '&:hover': { textDecoration: 'underline' },
}));

// Skeleton inherits its colour from the surrounding text colour, which is
// invisible against the navy bar.
const authSkeletonSx = { bgcolor: 'rgba(255, 255, 255, 0.18)' };

export default function Header({ screenSize }: HeaderProps) {
  const { t } = useTranslation();
  const { userStatus } = useMicroCoachDataState();
  const isResolvingAuth = userStatus === UserStatusType.LOADING;

  return (
    <HeaderBar component="header">
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          alignItems: 'center',
          // The 393 frame centres the brand; 744 and 1920 left-align it.
          justifyContent:
            screenSize === ScreenSize.SMALL ? 'center' : 'space-between',
          gap: 2,
        }}
      >
        <Typography
          variant="navTitle"
          component={RouterLink}
          to="/"
          sx={{
            color: 'designSystem.surface.white',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {t('header.brand')}
        </Typography>

        {/*
          Figma: nav group is 237 wide with the pill flush to the column edge.
          The mobile and tablet frames carry no pill at all — the header
          collapses to the brand alone below LARGE.

          This is the only part of the page that depends on who the user is, so
          it carries its own skeleton rather than the page waiting on auth.
        */}
        {screenSize === ScreenSize.LARGE && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={4}
            sx={{ minWidth: 237, justifyContent: 'flex-end' }}
          >
            {isResolvingAuth ? (
              <>
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={132}
                  height={54}
                  sx={{ ...authSkeletonSx, borderRadius: '27px' }}
                />
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={132}
                  height={54}
                  sx={{ ...authSkeletonSx, borderRadius: '27px' }}
                />
              </>
            ) : (
              <>
                <NavLink component={RouterLink} to="/signup">
                  {t('header.signup')}
                </NavLink>
                <LoginButton
                  component={RouterLink}
                  to="/login"
                  disableElevation
                >
                  {t('header.login')}
                </LoginButton>
              </>
            )}
          </Stack>
        )}
      </ContentRow>
    </HeaderBar>
  );
}
