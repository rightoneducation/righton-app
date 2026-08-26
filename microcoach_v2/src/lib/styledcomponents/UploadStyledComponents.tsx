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

/** Figma: 1369x148 and 660x451, both rx 32, white on a navy hairline. */
export const UploadCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: cardRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
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

// Figma: 405x42 rx 9, sky blue behind a selectedNavy 2px outline — the same
// "already holds a value" treatment the profile fields use.
export const SetupValue = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 42,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `2px solid ${theme.palette.designSystem.foreground.selectedNavy}`,
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

/**
 * Figma: 580x308 rx 26, sky blue behind a 2px navy dash of 12/12. The theme's
 * `status.uploading` trio was extracted for an upload design that was never
 * built — this is it.
 */
export const Dropzone = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.sizing.space3,
  width: '100%',
  minHeight: 308,
  padding: theme.sizing.space5,
  borderRadius: dropRadius,
  backgroundColor: theme.palette.designSystem.status.uploading,
  border: `2px dashed ${theme.palette.designSystem.foreground.selectedNavy}`,
  boxSizing: 'border-box',
  textAlign: 'center',
}));

interface FileRowProps {
  isError?: boolean;
}

/**
 * Figma: 47.5 tall, rx 11.75, lightGreen on a hairline green. The errored row
 * is the same shape in the error family, so one part covers both.
 */
export const UploadedFileRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError',
})<FileRowProps>(({ theme, isError }) => {
  const palette = theme.palette.designSystem;

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.sizing.space2,
    width: '100%',
    minHeight: 47.5,
    padding: `0 ${theme.sizing.space3}px`,
    borderRadius: fileRowRadius,
    backgroundColor: isError
      ? palette.status.errorTint
      : palette.status.lightGreen,
    border: `${theme.borders.borderWidth}px solid ${
      isError ? palette.status.errorStroke : palette.status.success
    }`,
    boxSizing: 'border-box',
  };
});

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
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: 14,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.accentBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
  fontWeight: 400,
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
}));

export type { ScreenSizeProps };
