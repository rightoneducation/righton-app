import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * Geometry for the sign-up wizard, read off the eight 1900x1024 frames in
 * teacherSignUp. Those frames are desktop-only — there is no tablet or mobile
 * export — so every below-LARGE behaviour here is a judgement call, noted at
 * the component that makes it.
 */

// Figma centres the form on a 500-wide column (x 720..1220).
const FORM_COLUMN = 500;
// The role cards sit on their own slightly narrower column (x 770..1170).
const CARD_COLUMN = 400;
const roleCardHeight = 93;
const roleCardRadius = 32;
const roleIconSize = 39;
const roleIconRadius = 12;
const fieldHeight = 40;
const fieldRadius = 8;
const codeBoxWidth = 38;
const codeBoxHeight = 46;
const codeBoxRadius = 7;
const ctaHeight = 58;
const ctaRadius = 29;
const pillHeight = 36;
const pillRadius = 18;
const addClassHeight = 31;
const classChipHeight = 50;
// Every outline in this flow is drawn at 2px — the fields, the code boxes and
// the Google button alike — rather than the 1px hairline used elsewhere.
const FIELD_BORDER_WIDTH = 2;

/** The centred column every step sits in. */
export const SignUpColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'width',
})<ScreenSizeProps & { width?: number }>(
  ({ theme, screenSize, width = FORM_COLUMN }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    // Below LARGE the fixed column would overflow the gutter, so it becomes
    // full-bleed inside whatever ContentRow already reserves.
    maxWidth: screenSize === ScreenSize.LARGE ? width : '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: theme.sizing.space5,
    boxSizing: 'border-box',
  }),
);

export const SignUpHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textAlign: 'center',
}));

export const SignUpSubheading = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textAlign: 'center',
}));

// Figma: 400x93, rx 32, white on a navy hairline; the chosen card fills with
// lightBlue. ButtonBase rather than Box so it is focusable and takes
// Enter/Space without reimplementing either.
export const RoleCard = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.sizing.space3,
  width: '100%',
  maxWidth: CARD_COLUMN,
  minHeight: roleCardHeight,
  padding: `0 ${theme.sizing.space5}px`,
  borderRadius: roleCardRadius,
  textAlign: 'left',
  backgroundColor: isSelected
    ? theme.palette.designSystem.foreground.lightBlue
    : theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: isSelected
      ? theme.palette.designSystem.foreground.lightBlue
      : theme.palette.designSystem.surface.skyBlue,
  },
}));

// Figma: 39 square, rx 12, on the same vertical ramp the upload icons use.
export const RoleIconTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: roleIconSize,
  height: roleIconSize,
  borderRadius: roleIconRadius,
  background: theme.palette.designSystem.gradients.uploadIcons,
  color: theme.palette.designSystem.surface.white,
}));

/**
 * Figma: 500x40 (or 244 when the names sit side by side), rx 8, white on a
 * darkBlue hairline. InputBase rather than TextField — the frames draw no
 * floating label or helper row, and TextField's chrome would have to be
 * unstyled back out again.
 */
export const SignUpField = styled(InputBase, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' &&
    prop !== 'isError' &&
    prop !== 'isFilled' &&
    prop !== 'isLocked',
})<{
  isActive?: boolean;
  isError?: boolean;
  /** Profile: a field that already holds a value reads sky blue, not white. */
  isFilled?: boolean;
  /** Profile: the email is explicitly uneditable. */
  isLocked?: boolean;
}>(({ theme, isActive, isError, isFilled, isLocked }) => ({
  width: '100%',
  height: fieldHeight,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: fieldRadius,
  // Figma (SignUpError1): the field being checked fills sky blue behind a
  // selectedNavy outline, so the row reads as busy rather than merely typed in.
  backgroundColor:
    isActive || isFilled
      ? theme.palette.designSystem.surface.skyBlue
      : theme.palette.designSystem.surface.white,
  // isError outranks isActive: a field still being checked that is already
  // invalid should read as invalid.
  border: `${FIELD_BORDER_WIDTH}px solid ${(() => {
    if (isError) return theme.palette.designSystem.status.errorStroke;
    // Locked reads as inert rather than merely unfocused, so it borrows the
    // recessive grey the filled verification box uses.
    if (isLocked) return theme.palette.designSystem.foreground.codeStrokeFilled;
    if (isActive || isFilled)
      return theme.palette.designSystem.foreground.selectedNavy;
    return theme.palette.designSystem.foreground.fadedDarkBlue;
  })()}`,
  boxSizing: 'border-box',
  // Figma boxes the locked field at 498x44 rx 7 rather than the 502x42 rx 9
  // every editable field uses — a slightly squarer, slightly taller inert box.
  ...(isLocked ? { minHeight: 44, borderRadius: 7 } : null),
  '& input': {
    padding: 0,
    ...theme.typography.placeholderLabel,
    color: theme.palette.designSystem.surface.atlanticNavy,
  },
  '& input::placeholder': {
    // central_v2 reddens the placeholder alongside the outline, so an empty
    // required field says which one it is without a separate message.
    color: isError
      ? theme.palette.designSystem.status.errorStroke
      : theme.palette.designSystem.surface.placeholderGrey,
    // Figma draws placeholders at 50%. Set explicitly rather than left to the
    // browser, whose own default differs (Firefox uses 0.54).
    opacity: isError ? 1 : 0.5,
  },
}));

/**
 * The error marker central_v2 puts at the end of an invalid field
 * (central_v2/src/images/errorIcon.svg). Its red is a gradient baked into the
 * asset, so it needs no token and cannot drift from the outline colour.
 */
export const FieldErrorIcon = styled('img')({
  width: 21,
  height: 20,
  flexShrink: 0,
});

/** The paired first/last name row, which stacks below LARGE. */
export const FieldRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  gap: theme.sizing.space2,
  width: '100%',
}));

// Google's own blue, kept as a literal: it is their brand asset rather than a
// value from our palette, so it must not drift with the design system.
const GOOGLE_BLUE = '#0966E0';

/**
 * Ported from central_v2's `GoogleSignUpButton` (central_v2/src/pages/SignUp.tsx)
 * so the two apps present Google sign-in identically: transparent fill, a 2px
 * Google-blue outline, and the blue carried by the label too.
 *
 * Figma embeds a 2146x1502 screenshot of this control rather than drawing it,
 * so central_v2's build is the better source of truth than the frame.
 */
export const GoogleButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: theme.sizing.space1 + 2,
  padding: `${theme.sizing.space1 + 2}px ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space1,
  backgroundColor: 'transparent',
  border: `${FIELD_BORDER_WIDTH}px solid ${GOOGLE_BLUE}`,
  color: GOOGLE_BLUE,
  ...theme.typography.headingSm,
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.wildSand,
    border: `${FIELD_BORDER_WIDTH}px solid ${GOOGLE_BLUE}`,
  },
}));

/** Google's mark, at the 30px central_v2 renders it. */
export const GoogleMark = styled('img')({
  width: 30,
  height: 30,
});

export const OrDivider = styled(Typography)(({ theme }) => ({
  ...theme.typography.headingSm,
  color: theme.palette.designSystem.foreground.slateNavy,
  textAlign: 'center',
}));

// Figma: 38x46, rx 7, on a 48px pitch. The outline recedes once a digit is
// present so the digit itself carries the emphasis.
export const CodeBox = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isFilled' && prop !== 'hasError',
})<{ isFilled: boolean; hasError?: boolean }>(({
  theme,
  isFilled,
  hasError,
}) => {
  const palette = theme.palette.designSystem;
  let strokeColor = palette.foreground.codeStroke;
  if (isFilled) strokeColor = palette.foreground.codeStrokeFilled;
  // central_v2 draws its error outline at 2px so it reads through the
  // filled state's lighter stroke; the colour is ours rather than its
  // hardcoded #F60E44.
  if (hasError) strokeColor = palette.status.errorStroke;

  return {
    width: codeBoxWidth,
    height: codeBoxHeight,
    borderRadius: codeBoxRadius,
    backgroundColor: theme.palette.designSystem.surface.white,
    border: `${FIELD_BORDER_WIDTH}px solid ${strokeColor}`,
    boxSizing: 'border-box',
    '& input': {
      padding: 0,
      textAlign: 'center',
      ...theme.typography.headingMd,
      fontWeight: 700,
      color: theme.palette.designSystem.foreground.slateNavy,
    },
  };
});

export const CodeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.sizing.space2,
}));

/**
 * Figma: 240x58, rx 29. The disabled treatment is drawn explicitly on
 * Page1_Default rather than being MUI's default, so it is spelled out here.
 */
export const SignUpCta = styled(Button)(({ theme }) => ({
  width: '100%',
  maxWidth: 240,
  minHeight: ctaHeight,
  padding: `0 ${theme.sizing.space6}px`,
  borderRadius: ctaRadius,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.ctaLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.designSystem.surface.neutralGray,
    border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.disabledStroke}`,
    color: theme.palette.designSystem.foreground.fadedSelectedNavy,
  },
}));

/** The wider CTA on the final step ("Upload PPQ files for analysis"). */
export const SignUpCtaWide = styled(SignUpCta)({
  maxWidth: 303,
});

// Figma: 108x36 (Login) and 123x36 (Verify), rx 18, solid accentBlue.
export const SignUpPill = styled(Button)(({ theme }) => ({
  minWidth: 108,
  minHeight: pillHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: pillRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.headingSm,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

// Figma (login): 132x36, the same pill in fadedNavyBlue — a secondary action
// sitting below the primary one, so it recedes rather than competing.
export const SignUpPillMuted = styled(SignUpPill)(({ theme }) => ({
  minWidth: 132,
  backgroundColor: theme.palette.designSystem.foreground.fadedNavyBlue,
}));

// Figma: 181x31, rx 15.5 — a pill, so the radius tracks the height.
export const AddClassChip = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minHeight: addClassHeight,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: addClassHeight / 2,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.lightBlue,
  },
}));

/**
 * The password rules, shown beside the fields while one is focused. Figma:
 * 244x148 rx 8 in accentBlue with white copy — an inline panel rather than
 * the hover tooltip central_v2 uses for the same content.
 */
export const PasswordRulesPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
  width: '100%',
  maxWidth: 244,
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

// Figma: 160x32 rx 8 in darkBlue — squarer and smaller than the pills, so it
// gets its own part rather than bending SignUpPill.
export const ResetButton = styled(Button)(({ theme }) => ({
  minWidth: 160,
  minHeight: 32,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.surface.darkBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.headingMd,
  fontWeight: 700,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

// Figma: 600x40, rx 8 — wider than the wizard fields and filled sky blue.
export const TeacherSelectField = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: fieldHeight,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: fieldRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `${FIELD_BORDER_WIDTH}px solid ${theme.palette.designSystem.foreground.fadedSelectedNavy}`,
  boxSizing: 'border-box',
}));

/**
 * Admin picks a class from a dropdown rather than the teacher's chip grid —
 * an admin sees classes across every teacher, which chips do not scale to.
 * Figma: 600x40 rx 8, same box as the teacher select above it but filled
 * white, with a navy chevron.
 */
export const ClassSelect = styled(Select<string>)(({ theme }) => ({
  width: '100%',
  height: fieldHeight,
  borderRadius: fieldRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.headingSm,
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: FIELD_BORDER_WIDTH,
    borderColor: theme.palette.designSystem.foreground.fadedSelectedNavy,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.foreground.fadedSelectedNavy,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.designSystem.background.navyBlue,
  },
}));

/** Figma lays the class chips 3-up; below LARGE they fall to two per row. */
export const ClassChipGrid = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.LARGE ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
  // Figma: 20 between rows (552→622) and between columns.
  gap: theme.sizing.space4,
  width: '100%',
}));

// Figma: 183x50, rx 25. The trailing "More" chip is drawn in the disabled
// treatment, so it shares the CTA's disabled colours rather than inventing new.
export const ClassChip = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isMore',
})<{ isSelected?: boolean; isMore?: boolean }>(({
  theme,
  isSelected,
  isMore,
}) => {
  const palette = theme.palette.designSystem;

  return {
    minHeight: classChipHeight,
    padding: `0 ${theme.sizing.space4}px`,
    borderRadius: classChipHeight / 2,
    backgroundColor: isMore
      ? palette.surface.neutralGray
      : palette.surface.skyBlue,
    border: isMore
      ? `${theme.borders.borderWidth}px solid ${palette.foreground.disabledStroke}`
      : `${theme.borders.borderWidth}px solid ${
          isSelected ? palette.background.navyBlue : 'transparent'
        }`,
    color: palette.surface.atlanticNavy,
    ...theme.typography.rubikBody,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: isMore
        ? palette.surface.neutralGray
        : palette.foreground.lightBlue,
    },
  };
});

export type { ScreenSizeProps };
