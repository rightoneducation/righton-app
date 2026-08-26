import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Link, { LinkProps } from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentRow from './ContentRow';
import { ScreenSize, UserStatusType } from '../lib/MicroCoachModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { useMisconceptions } from '../hooks/useMisconceptions';

/**
 * `signup` is the wizard's own chrome: the frames draw the brand alone on
 * every step but the last, since offering a Sign Up link to someone already
 * signing up makes no sense. Its final step still shows an identity, but that
 * comes from the LOGGEDIN branch rather than the variant.
 */
export type HeaderVariant = 'public' | 'signup' | 'app';

interface HeaderProps {
  screenSize: ScreenSize;
  variant?: HeaderVariant;
  onLogOut?: () => void;
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
  // Figma width; height falls out of the label's line box plus its padding so
  // it tracks the type scale rather than being asserted.
  minWidth: 132,
  padding: `${theme.sizing.space2}px ${theme.sizing.space5}px`,
  // Half the derived height (54), so the ends are true semicircles.
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

// Figma (teacher sign-up, Page6): 215x36 rx 8, solid darkBlue on a cream
// hairline. Squarer than the app header's IdentityPill, which is a 22-radius
// lozenge — the two headers present identity differently.
const PublicIdentityPill = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.surface.darkBlue,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.fadedCream}`,
  color: theme.palette.designSystem.background.cream,
  ...theme.typography.headingSm,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

// Figma (profile): 108x41 rx 20.5 — a transparent pill on a white hairline,
// sitting left of the identity.
const LogOutButton = styled(Button)(({ theme }) => ({
  minHeight: 41,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: 20.5,
  backgroundColor: 'transparent',
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.white}`,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.fadedWhiteHover,
  },
}));

const appPillRadius = 22;

const IdentityPill = styled(Box)<RouterExtras>(({ theme }) => ({
  display: 'block',
  maxWidth: 362,
  padding: `${theme.sizing.space1}px ${theme.sizing.space4}px`,
  lineHeight: '28px',
  borderRadius: appPillRadius,
  backgroundColor: theme.palette.designSystem.background.fadedCreamFill,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.fadedCreamStroke}`,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.rubikBody,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  boxSizing: 'border-box',
}));

const ClassSelect = styled(Select<string>, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  minWidth: screenSize === ScreenSize.SMALL ? 140 : 180,
  height: 44,
  borderRadius: appPillRadius,
  backgroundColor: theme.palette.designSystem.background.fadedCreamFill,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.rubikBody,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.background.fadedCreamStroke,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.surface.white,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.surface.white,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.designSystem.surface.white,
  },
}));

// Skeleton inherits its colour from the surrounding text colour, which is
// invisible against the navy bar.
const authSkeletonSx = { bgcolor: 'designSystem.background.fadedWhiteVeil' };

export default function Header({
  screenSize,
  variant = 'public',
  onLogOut,
}: HeaderProps) {
  const { t } = useTranslation();
  const { userStatus, userProfile } = useMicroCoachDataState();
  const isResolvingAuth = userStatus === UserStatusType.LOADING;

  const { session } = useMisconceptions();
  const [selectedClassId, setSelectedClassId] = React.useState(
    session.selectedClassId,
  );

  const teacherName = userProfile?.teacherName ?? session.teacher.displayName;
  const teacherEmail = userProfile?.email ?? session.teacher.email;

  const isCompactBrand = variant === 'app' && screenSize === ScreenSize.SMALL;

  const brandVariant = (() => {
    if (isCompactBrand) return 'smallTitle';
    // Every sign-up frame sets the brand at Rubik 32/600, the same as the app
    // header. `public` stays on navTitle: no landing frame survives to check
    // it against, so changing it there would be a guess.
    if (variant === 'app' || variant === 'signup') return 'appTitle';
    return 'navTitle';
  })();

  return (
    <HeaderBar component="header">
      <ContentRow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          alignItems: 'center',
          // The 393 frame centres the brand; 744 and 1920 left-align it.
          justifyContent:
            screenSize === ScreenSize.SMALL && variant !== 'app'
              ? 'center'
              : 'space-between',
          gap: 2,
        }}
      >
        <Typography
          variant={brandVariant}
          component={RouterLink}
          to="/"
          sx={{
            color: 'designSystem.surface.white',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {isCompactBrand ? t('header.brandShort') : t('header.brand')}
        </Typography>

        {variant === 'app' && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ justifyContent: 'flex-end', minWidth: 0 }}
          >
            {isResolvingAuth ? (
              <Skeleton
                animation="wave"
                variant="rounded"
                width={180}
                height={44}
                sx={{ ...authSkeletonSx, borderRadius: `${appPillRadius}px` }}
              />
            ) : (
              <>
                {screenSize === ScreenSize.LARGE && (
                  <>
                    <LogOutButton disableElevation onClick={onLogOut}>
                      {t('profile.logOut')}
                    </LogOutButton>
                    {/* The frame gives no separate control for reaching the
                        profile, so the identity itself is the way in. */}
                    <IdentityPill
                      component={RouterLink}
                      to="/profile"
                      sx={{ textDecoration: 'none' }}
                    >
                      <Box component="span" sx={{ fontWeight: 500 }}>
                        {teacherName}
                      </Box>
                      {` • ${teacherEmail}`}
                    </IdentityPill>
                  </>
                )}
                <ClassSelect
                  screenSize={screenSize}
                  value={selectedClassId}
                  IconComponent={KeyboardArrowDownIcon}
                  onChange={(event) => setSelectedClassId(event.target.value)}
                  inputProps={{ 'aria-label': t('header.classSwitcher') }}
                >
                  {session.classes.map((classOption) => (
                    <MenuItem key={classOption.id} value={classOption.id}>
                      {classOption.name}
                    </MenuItem>
                  ))}
                </ClassSelect>
              </>
            )}
          </Stack>
        )}

        {/*
          Figma: nav group is 237 wide with the pill flush to the column edge.
          The mobile and tablet frames carry no pill at all — the header
          collapses to the brand alone below LARGE.

          This is the only part of the page that depends on who the user is, so
          it carries its own skeleton rather than the page waiting on auth.
        */}
        {variant !== 'app' &&
          screenSize === ScreenSize.LARGE &&
          userStatus === UserStatusType.LOGGEDIN && (
            // Figma (sign-up Page6): once the wizard commits a profile the
            // public header presents identity instead of the auth links.
            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
              <PublicIdentityPill>{teacherName}</PublicIdentityPill>
            </Stack>
          )}

        {variant === 'public' &&
          screenSize === ScreenSize.LARGE &&
          userStatus !== UserStatusType.LOGGEDIN && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={4}
              sx={{ justifyContent: 'flex-end' }}
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
