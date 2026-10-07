import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { pageGutter } from '../../components/ContentRow';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * Account Settings (microcoach-assets/Account, 1686 wide): the navy identity
 * card on the left, a 920 form column on the right, both on the cool-white page
 * with a pattern cluster in two corners.
 */

const SIDEBAR_WIDTH = 325;
const FORM_WIDTH = 920;
const AVATAR_SIZE = 169;
const chipRadius = 18;
const fieldHeight = 42;
const fieldRadius = 9;

export const ProfilePage = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  position: 'relative',
  width: '100%',
  flexGrow: 1,
  paddingTop: theme.sizing.space11,
  paddingBottom: theme.sizing.space12,
  paddingLeft: pageGutter(theme, screenSize),
  paddingRight: pageGutter(theme, screenSize),
  backgroundColor: theme.palette.designSystem.background.coolWhite,
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

// Figma: the two corner clusters, at 30% like the dashboard band. Decoration,
// so LARGE only, where the layout leaves room around them.
export const PatternCorner = styled('img')({
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  userSelect: 'none',
});

/** Figma: card and form side by side at LARGE (~87 apart), stacked below. */
export const ProfileLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    alignItems: isLarge ? 'stretch' : 'center',
    justifyContent: 'center',
    gap: isLarge ? theme.sizing.space12 : theme.sizing.space8,
    width: '100%',
    maxWidth: isLarge ? SIDEBAR_WIDTH + theme.sizing.space12 + FORM_WIDTH : undefined,
    marginLeft: 'auto',
    marginRight: 'auto',
  };
});

/**
 * Figma: 325 wide, rx 16, darkBlue. It runs the height of the form column, with
 * the identity at the top and Log out at the bottom.
 */
export const ProfileSidebar = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space8,
  flexShrink: 0,
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? SIDEBAR_WIDTH : '100%',
  padding: theme.sizing.space6,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.darkBlue,
  color: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

/** The card's upper half: avatar and Edit Picture, then name and join date. */
export const SidebarIdentity = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space2,
  textAlign: 'center',
}));

export const AvatarGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

// Figma: a 169 skyBlue circle with the initials in Rubik 96, selectedNavy.
export const InitialsAvatar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.foreground.selectedNavy,
  fontFamily: theme.typography.rubikBody.fontFamily,
  fontSize: 96,
  fontWeight: 400,
  letterSpacing: '-0.02em',
  lineHeight: 1,
}));

/** Figma: 97x36 rx18 skyBlue with a navy Rubik 14 label. */
export const EditPictureChip = styled(Button)(({ theme }) => ({
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  cursor: 'default',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
  },
}));

/** Figma: 194x42 rx21, white on a selectedNavy hairline, at the card's foot. */
export const SidebarLogOut = styled(Button)(({ theme }) => ({
  minWidth: 194,
  minHeight: 42,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: 21,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.selectedNavy}`,
  color: theme.palette.designSystem.foreground.selectedNavy,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
  },
}));

/**
 * Figma: heading, then the sections ~64 apart. The heading sits ~20 below the
 * card's top edge, which the column's own top inset supplies.
 */
export const ProfileForm = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space11,
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? FORM_WIDTH : '100%',
  paddingTop: screenSize === ScreenSize.LARGE ? theme.sizing.space4 : 0,
  boxSizing: 'border-box',
}));

// The heading over the first section (Figma: ~24 between).
export const FormIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
}));

export const ProfileHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.displayBold,
  color: theme.palette.designSystem.surface.darkBlue,
}));

/** A titled block: Profile Information, Your Classes, Password. */
export const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space3,
  width: '100%',
}));

export const ProfileSectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  color: theme.palette.designSystem.foreground.slateNavy,
}));

/** Two fields side by side at LARGE (Figma: 455 + 10 + 455), stacked below. */
export const FieldPair = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  gap: theme.sizing.space2,
  width: '100%',
}));

/** A label (and any note under it) over its field. */
export const LabelledField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
  flex: '1 1 0',
  minWidth: 0,
  width: '100%',
}));

interface ProfileInputProps {
  isLocked?: boolean;
  isError?: boolean;
}

/**
 * Figma: 455x42 rx9 white on a greyAccent hairline (#E0E4EF, 6 off), Open Sans
 * 16/600 black — Rubik stands in. Email and School are locked: 44 tall, rx7, a
 * #CCCCCC hairline (codeStrokeFilled) and greyed text.
 */
export const ProfileInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isLocked' && prop !== 'isError',
})<ProfileInputProps>(({ theme, isLocked, isError }) => {
  const palette = theme.palette.designSystem;
  let borderColor = palette.foreground.greyAccent;
  if (isLocked) borderColor = palette.foreground.codeStrokeFilled;
  if (isError) borderColor = palette.status.errorStroke;

  return {
    width: '100%',
    minHeight: isLocked ? 44 : fieldHeight,
    padding: `0 ${theme.sizing.space2}px`,
    borderRadius: isLocked ? 7 : fieldRadius,
    backgroundColor: palette.surface.white,
    border: `${theme.borders.borderWidth}px solid ${borderColor}`,
    color: isLocked ? palette.foreground.mutedGrey : palette.surface.black,
    ...theme.typography.rubikBody,
    fontWeight: isLocked ? 400 : 600,
    boxSizing: 'border-box',
    '& input': { padding: 0 },
    '&.Mui-focused': {
      borderColor: isError ? palette.status.errorStroke : palette.foreground.accentBlue,
    },
  };
});

/** A class row: the name in a field-shaped box, then its delete tile. */
export const ClassRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space2,
  width: '100%',
}));

export const ClassList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
}));

export const ClassName = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 auto',
  minWidth: 0,
  minHeight: fieldHeight,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: fieldRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.greyAccent}`,
  color: theme.palette.designSystem.surface.black,
  ...theme.typography.rubikBody,
  fontWeight: 600,
  boxSizing: 'border-box',
}));

/** Figma: 126x36 (Edit Information) and 137x36 (Change Password), rx18. */
export const ProfileAction = styled(Button)(({ theme }) => ({
  minHeight: 36,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

/** Figma (Account6): a light-green banner with a navy bold message and an ×. */
export const SuccessBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space3,
  padding: `${theme.sizing.space2}px ${theme.sizing.space4}px`,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.success}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBodyBold,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
}));

export type { ScreenSizeProps };
