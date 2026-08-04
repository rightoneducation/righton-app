import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

const badgeRadius = 18;
const chipRadius = 16;

export const BADGE_SLOT_HEIGHT = 36;
const ctaRadius = 25;
const bannerRadius = 20;

interface FocusProps {
  isFocus: boolean;
}

const noFocus = (prop: PropertyKey) => prop !== 'isFocus';
const noScreenSizeOrFocus = (prop: PropertyKey) =>
  noScreenSize(prop) && noFocus(prop);

export const MisconceptionCard = styled(Paper, {
  shouldForwardProp: noScreenSizeOrFocus,
})<ScreenSizeProps & FocusProps>(({ theme, screenSize, isFocus }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minHeight: screenSize === ScreenSize.LARGE ? 454 : undefined,
  backgroundColor: isFocus
    ? theme.palette.designSystem.surface.skyBlue
    : theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  borderRadius: theme.sizing.sectionRadius,
  padding:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space6
      : theme.sizing.space5,
  boxSizing: 'border-box',
}));

export const BadgeSlot = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  minHeight: BADGE_SLOT_HEIGHT,
});

export const FocusBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  height: BADGE_SLOT_HEIGHT,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: badgeRadius,
  backgroundColor: theme.palette.designSystem.foreground.brightBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.xsLabel,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}));

export const PrevalenceChip = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const CountChip = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const ResultsBanner = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space3,
  padding: `${theme.sizing.space2}px ${theme.sizing.space4}px`,
  borderRadius: bannerRadius,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.success}`,
  boxSizing: 'border-box',
}));

export const StrongUnderstandingBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: `${theme.sizing.space3}px ${theme.sizing.space4}px`,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  boxSizing: 'border-box',
}));

export const CardCta = styled(Button, {
  shouldForwardProp: noFocus,
})<FocusProps>(({ theme, isFocus }) => ({
  marginTop: 'auto',
  alignSelf: 'stretch',
  padding: `${theme.sizing.space2}px ${theme.sizing.space4}px`,
  borderRadius: ctaRadius,
  backgroundColor: isFocus
    ? theme.palette.designSystem.surface.atlanticNavy
    : theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.darkBlue,
  },
}));

export type { ScreenSizeProps };
