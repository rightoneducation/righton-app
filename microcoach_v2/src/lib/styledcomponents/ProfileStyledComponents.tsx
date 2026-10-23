import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Snackbar from '@mui/material/Snackbar';
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
const deleteTileWidth = 44;
const deleteTileHeight = 45;
const toastMinHeight = 59;

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
  // A picture fills the circle instead of the initials.
  overflow: 'hidden',
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
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
    textDecoration: 'underline',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
    color: theme.palette.designSystem.surface.atlanticNavy,
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
  if (isError) borderColor = palette.status.fieldErrorStroke;

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
      borderColor: isError ? palette.status.fieldErrorStroke : palette.foreground.accentBlue,
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

// rev4 UserAccount_1: the filled trash on a 44x45 white tile, rx 16, beside
// each class. White can't lighten, so hover goes sky blue like the page's
// other white buttons.
export const ClassDeleteButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  width: deleteTileWidth,
  height: deleteTileHeight,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.white,
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
  },
}));

// rev4 UserAccount_NewClassFails / ChangePassword_2: the toast floats ~40
// below the header, centred over the content column rather than the window.
export const ToastSnackbar = styled(Snackbar)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    top: theme.sizing.headerHeight + theme.sizing.space7,
  },
  [theme.breakpoints.up('lg')]: {
    left: `calc(50% + ${SIDEBAR_WIDTH / 2}px)`,
  },
}));

export type ToastTone = 'success' | 'error';

// Figma: ~470x59 rx20 on a hairline border, Rubik 16 bold navy ~20 in, a grey
// close circle at the right. Success is lightGreen on success; an error is
// the pink wash on errorStroke.
export const Toast = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: ToastTone }>(({ theme, tone }) => {
  const { status } = theme.palette.designSystem;
  const isError = tone === 'error';

  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.sizing.space3,
    minHeight: toastMinHeight,
    padding: `0 ${theme.sizing.space2}px 0 ${theme.sizing.space4}px`,
    borderRadius: theme.sizing.space4,
    backgroundColor: isError ? status.errorToast : status.lightGreen,
    border: `${theme.borders.borderWidth}px solid ${isError ? status.errorStroke : status.success}`,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    color: theme.palette.designSystem.surface.atlanticNavy,
    ...theme.typography.rubikBody,
    fontWeight: 700,
    boxSizing: 'border-box',
  };
});

// rev5 ChangePasswordError: a password field's label, error line, rules and
// input, ~12 apart (LabelledField's 4 is the name fields' spacing).
export const PasswordFieldGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
}));

// The new password's rules, always shown: Rubik 12 black, a disc list indented
// 18 as central_v2's PasswordRequirementsList is, ~8 between lines.
export const PasswordRules = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  margin: 0,
  paddingLeft: 18,
  listStyleType: 'disc',
  color: theme.palette.designSystem.surface.black,
  ...theme.typography.microLabel,
}));

// rev5 ChangePasswordError: Cancel then Done, ~20 apart.
export const PasswordActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space4,
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
    backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  },
}));

// rev5 ChangePasswordError's Done: ProfileAction in navy.
export const ProfileActionPrimary = styled(ProfileAction)(({ theme }) => ({
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

// rev5 AddAClass: "+ Add another class" under the list, a steel-blue pill.
// Greyed out while a new class's field is open, so only one can be open.
// Styled components rather than `sx`: on this styled(Button) the sx callback
// never applied.
export const AddClassButton = styled(ProfileAction)(({ theme }) => ({
  alignSelf: 'flex-start',
  gap: theme.sizing.space1,
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.designSystem.surface.ashyGray, 0.5),
    color: theme.palette.designSystem.surface.white,
  },
}));

// Done under a new class's field: navy once there is a name, grey until then.
// rev5 draws its label at 16, a size up from the pill beside it.
export const AddClassSubmit = styled(ProfileActionPrimary)(({ theme }) => ({
  padding: `0 ${theme.sizing.space5}px`,
  ...theme.typography.rubikBody,
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.designSystem.surface.ashyGray, 0.5),
    color: theme.palette.designSystem.surface.white,
  },
}));

// Done and the greyed "+ Add another class", side by side under the field.
export const AddClassActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space4,
}));

export type { ScreenSizeProps };
