import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * RTD upload and its review step, read off the finalflows frames. The upload
 * page is one screen in four states (empty, one errored, one done, both done);
 * the states differ only inside the dropzone, so they are props here rather
 * than separate components.
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

/**
 * Figma: 1368x147 and 659x450, both rx 32, a navy hairline and — deliberately —
 * no fill. These cards sit straight on the cream page; a white fill would read
 * as a second surface the frames never draw.
 */
export const UploadCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: cardRadius,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  boxSizing: 'border-box',
}));

/** The Teacher / Class / Week row, which stacks below LARGE. */
export const SetupRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.LARGE ? 'repeat(3, 1fr)' : '1fr',
  gap: theme.sizing.space5,
  width: '100%',
}));

interface SetupValueProps {
  isLocked?: boolean;
}

/**
 * Figma: 405x42 rx 9, sky blue behind a 2px selectedNavy outline — the same
 * "already holds a value" treatment the profile fields use.
 *
 * The three setup fields are not one control. Teacher and Class are outlined at
 * 50% and Week at 70%, which is the frames' way of saying the first two are
 * locked and the third is the teacher's to change. Collapsing them to one
 * strength loses that, so the alpha is a prop.
 */
export const SetupValue = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLocked',
})<SetupValueProps>(({ theme, isLocked }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 42,
  padding: `0 ${theme.sizing.space2}px`,
  // Figma: rx 9, a shade rounder than the space1 (8) used elsewhere.
  borderRadius: 9,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `2px solid ${
    isLocked
      ? theme.palette.designSystem.foreground.lockedNavy
      : theme.palette.designSystem.foreground.fadedSelectedNavy
  }`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  boxSizing: 'border-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

/** The two upload cards sit side by side at LARGE and stack below it. */
export const DropzoneRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.LARGE ? 'repeat(2, 1fr)' : '1fr',
  gap: theme.sizing.space5,
  width: '100%',
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

/**
 * Figma: 306x52 rx 12 filled accentBlue — "Upload both files to continue" is a
 * chip, not a caption. It sits directly above the disabled CTA and carries the
 * same weight as the control it explains.
 */
export const UploadHintChip = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  minHeight: 52,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.uploadLabel,
  textAlign: 'center',
  boxSizing: 'border-box',
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

export const SummaryCardBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  padding: theme.sizing.space5,
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
  paddingBottom: theme.sizing.space3,
  borderBottom: theme.borders.subtle,
  '&:last-of-type': {
    paddingBottom: 0,
    borderBottom: 'none',
  },
}));

export type { ScreenSizeProps };
