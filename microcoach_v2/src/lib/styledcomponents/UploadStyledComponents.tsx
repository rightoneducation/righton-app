import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import {
  dashboardCardShadow,
  patternPageBackground,
} from './DashboardStyledComponents';

/*
 * MIU upload, review and submitted steps (microcoach-assets/Upload frames). The
 * upload page is one screen in four states (empty, one errored, one done, both
 * done); the states differ only inside the file cards, so they are props here
 * rather than separate components.
 */

const cardRadius = 32;
const dropRadius = 26;
const fileRowRadius = 12;
const uploadPillHeight = 50;
const formatHintHeight = 28;
const summaryHeaderHeight = 69;
// Figma dashes the dropzone at exactly 12 on, 12 off. `border-style: dashed`
// lets the browser pick its own rhythm, so the edge is drawn as an inline SVG
// instead — the one way to assert a dash length on a rounded rect. The colour
// still comes from the theme, so no literal escapes into the component.
const dashedEdge = (color: string) => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">` +
    `<rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" ` +
    `rx="${dropRadius - 1}" fill="none" stroke="${color}" stroke-width="2" ` +
    `stroke-dasharray="12 12"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/** The page: the dashboard's cool white and tiled band, without its sidebar. */
export const UploadLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: 1,
  ...patternPageBackground(theme, screenSize),
}));

/**
 * Figma: 1360x148 (setup) and 660x451 (files), rx 32, white on a navy hairline
 * with the dashboard card's soft shadow.
 */
export const UploadCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  width: '100%',
  padding: `${theme.sizing.space6}px ${theme.sizing.space7}px`,
  borderRadius: cardRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  boxShadow: dashboardCardShadow,
  boxSizing: 'border-box',
}));

/** Class and Week side by side, stacking below LARGE. */
export const SetupRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  gap: screenSize === ScreenSize.LARGE ? theme.sizing.space7 : theme.sizing.space5,
  width: '100%',
}));

/** A field's label over its select (Figma: ~12 between). */
export const SetupField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  flex: '1 1 0',
  minWidth: 0,
}));

/**
 * Figma: 614x42 rx 9. Empty it is unfilled on a 70% darkBlue outline; holding a
 * value it turns sky blue on a 70% selectedNavy outline.
 */
export const SetupSelect = styled(Select<string>, {
  shouldForwardProp: (prop) => prop !== 'isEmpty',
})<{ isEmpty: boolean }>(({ theme, isEmpty }) => ({
  width: '100%',
  height: 42,
  // Figma: rx 9, a shade rounder than the space1 (8) used elsewhere.
  borderRadius: 9,
  backgroundColor: isEmpty
    ? theme.palette.designSystem.surface.white
    : theme.palette.designSystem.surface.skyBlue,
  color: isEmpty
    ? theme.palette.designSystem.surface.placeholderGrey
    : theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: isEmpty
      ? theme.palette.designSystem.foreground.fadedDarkBlue
      : theme.palette.designSystem.foreground.fadedSelectedNavy,
  },
  '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline':
    {
      borderWidth: 2,
      borderColor: theme.palette.designSystem.foreground.selectedNavy,
    },
  '& .MuiSelect-icon': {
    color: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

/** The two file cards, ~51 apart (Figma), side by side at LARGE. */
export const DropzoneRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  gap: theme.sizing.space9,
  width: '100%',
  '& > *': { flex: '1 1 0', minWidth: 0 },
}));

interface DropzoneProps {
  isDragOver?: boolean;
}

/**
 * Figma: 580x308 rx 26, sky blue behind a 2px navy dash of 12/12 at half
 * strength, deepening to fadedLightNavyBlue while a file is over it.
 */
export const Dropzone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragOver',
})<DropzoneProps>(({ theme, isDragOver }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.sizing.space3,
  width: '100%',
  minHeight: 308,
  padding: theme.sizing.space5,
  borderRadius: dropRadius,
  backgroundColor: isDragOver
    ? theme.palette.designSystem.foreground.fadedLightNavyBlue
    : theme.palette.designSystem.surface.skyBlue,
  backgroundImage: dashedEdge(theme.palette.designSystem.foreground.lockedNavy),
  boxSizing: 'border-box',
  textAlign: 'center',
}));

interface FileRowProps {
  isError?: boolean;
}

/**
 * Figma: 47.5 tall completed, 67.5 errored, rx 11.75 — one shape in two colour
 * families. The extra 20px is not a different box: the errored frame draws the
 * "Unsupported file format" line *inside* this border, so the row is a column
 * and its height falls out of the content rather than being asserted.
 *
 * The fill is `status.error`, the pale form-level wash — not `status.errorTint`,
 * which is the saturated pink the activity templates use to mark a wrong step.
 */
export const UploadedFileRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError',
})<FileRowProps>(({ theme, isError }) => {
  const palette = theme.palette.designSystem;

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: theme.sizing.space1,
    width: '100%',
    minHeight: 47.5,
    padding: `${theme.sizing.space1}px ${theme.sizing.space3}px`,
    borderRadius: fileRowRadius,
    backgroundColor: isError ? palette.status.error : palette.status.lightGreen,
    // Figma hairlines these at 0.5, half the borders.borderWidth used elsewhere.
    border: `0.5px solid ${
      isError ? palette.status.errorStroke : palette.status.success
    }`,
    boxSizing: 'border-box',
  };
});

/** The filename and its status marker — the row's first line. */
export const UploadedFileMain = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space2,
  width: '100%',
}));

/** Figma: 126x50 (and 134 when the label is longer), rx 25. */
export const UploadPill = styled(Button)(({ theme }) => ({
  minWidth: 126,
  minHeight: uploadPillHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: uploadPillHeight / 2,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

/** Figma: 183x28 rx 11.5, an outlined accentBlue chip under the drop copy. */
export const FormatHint = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: formatHintHeight,
  padding: `0 ${theme.sizing.space2}px`,
  // Figma: 183x28 rx 11.5 — squarer than a pill, so the radius is asserted
  // rather than derived from the height.
  borderRadius: 11.5,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.accentBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
  fontWeight: 400,
}));

// Figma (Upload2 hover): a 262x52 rx 12 black bubble, Rubik 16 white, its
// arrow pointing down at the disabled Continue.
export const continueTooltipSx = {
  tooltip: {
    sx: {
      bgcolor: 'designSystem.surface.black',
      color: 'designSystem.surface.white',
      typography: 'rubikBody',
      borderRadius: '12px',
      px: 2,
      py: 1.75,
    },
  },
  arrow: { sx: { color: 'designSystem.surface.black' } },
};

/** The × that removes a picked file (Figma: a grey circled cross). */
export const RemoveFileButton = styled(IconButton)(({ theme }) => ({
  padding: theme.sizing.space0,
  color: theme.palette.designSystem.foreground.mutedGrey,
}));

/**
 * "Back to homepage" / "Back to upload". Figma gives these no fill or outline
 * at all — just selectedNavy text at the CTA's own size, so they read as a way
 * back rather than a second primary action.
 */
export const GhostAction = styled(Button)(({ theme }) => ({
  minHeight: 58,
  padding: `0 ${theme.sizing.space5}px`,
  backgroundColor: 'transparent',
  color: theme.palette.designSystem.foreground.selectedNavy,
  ...theme.typography.ctaLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
}));

/**
 * The review step's summary card. Figma draws it as paths rather than rects,
 * which is why it went missing on the first pass: a 916x69 navy band with only
 * its top corners rounded (rx 32), above a 915x461 white body on a navy
 * hairline. `overflow: hidden` on the card lets the flat-bottomed header take
 * the parent's corners rather than repeating them.
 */
export const SummaryCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  borderRadius: cardRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  boxShadow: dashboardCardShadow,
  boxSizing: 'border-box',
}));

/** Figma: 69 tall, atlanticNavy, with the heading reversed out in white. */
export const SummaryCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: summaryHeaderHeight,
  padding: `0 ${theme.sizing.space5}px`,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
}));

// The rows carry their own vertical rhythm, so the body only insets them
// sideways (Figma: dividers run 24 in from the card edge).
export const SummaryCardBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.sizing.space1}px ${theme.sizing.space5}px`,
}));

/** The review step's summary rows: label left, value right. */
export const SummaryRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
  justifyContent: 'space-between',
  gap: theme.sizing.space2,
  width: '100%',
  // Figma (Upload4_new): ~80 between dividers, the text ~16 in from their ends.
  padding: `${theme.sizing.space5}px ${theme.sizing.space3}px`,
  // Figma: 0.5 #A3A3A3 (7 off disabledStroke, so it reuses it).
  borderBottom: `0.5px solid ${theme.palette.designSystem.foreground.disabledStroke}`,
  boxSizing: 'border-box',
  '&:last-of-type': {
    borderBottom: 'none',
  },
}));

export type { ScreenSizeProps };
