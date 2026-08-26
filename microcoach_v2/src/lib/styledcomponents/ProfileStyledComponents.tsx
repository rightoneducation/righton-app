import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * Account Settings. Read off the 1921x1159 profile frame — the first
 * two-column screen in this flow, so it does not reuse SignUpColumn.
 */

const SIDEBAR_WIDTH = 325;
const FORM_WIDTH = 502;
const avatarRadius = 28;
const pillRadius = 18;

/** Figma: the navy card and the form column sit side by side at LARGE. */
export const ProfileLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.sizing.space12,
  width: '100%',
}));

// Figma: 325x891 rx16 in darkBlue. Height is left to the content rather than
// asserted — the frame's 891 is one canvas, not a rule.
export const ProfileSidebar = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space4,
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? SIDEBAR_WIDTH : '100%',
  padding: theme.sizing.space6,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.darkBlue,
  color: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

// Figma: 123x152, rx 28.6, a #1F81B3 plate behind a near-white 2.3px ring.
export const ProfileAvatar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 123,
  height: 152,
  borderRadius: avatarRadius,
  backgroundColor: theme.palette.designSystem.chart.line,
  border: `2px solid ${theme.palette.designSystem.background.offWhite}`,
  color: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

/** Figma: 131x36 rx18 accentBlue, under the sidebar name. */
export const ProfileRolePill = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 131,
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.rubikBody,
  whiteSpace: 'nowrap',
}));

/** Figma: 97x36 rx18 skyBlue with navy label. */
export const EditPictureChip = styled(Button)(({ theme }) => ({
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
  fontWeight: 400,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.lightBlue,
  },
}));

export const ProfileForm = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? FORM_WIDTH : '100%',
}));

export const ProfileHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: '40px',
  color: theme.palette.designSystem.surface.darkBlue,
  textAlign: 'center',
}));

export const ProfileSectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  color: theme.palette.designSystem.foreground.slateNavy,
}));

/** Figma: 126x36 (Edit Information) and 137x36 (Change Password). */
export const ProfileAction = styled(Button)(({ theme }) => ({
  alignSelf: 'center',
  minHeight: 36,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: pillRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.rubikSubBold,
  fontWeight: 400,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export type { ScreenSizeProps };
