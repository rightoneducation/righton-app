import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import {
  dashboardCardShadow,
  patternPageBackground,
} from './DashboardStyledComponents';
import { pageGutter } from '../../components/ContentRow';

/*
 * Understand Your Students' Thinking (/review, microcoach-assets/Misconceptions,
 * 1686 wide): the dashboard's stepper row, a title group, three misconception
 * cards, the per-question correct-response tiles and a disclaimer, on the
 * dashboard's cool-white page with its tiled band.
 */

const pillHeight = 50;
const tagRadius = 10;

export const UnderstandPage = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  flexGrow: 1,
  paddingTop: screenSize === ScreenSize.LARGE ? theme.sizing.space7 : theme.sizing.space6,
  paddingBottom: theme.sizing.space12,
  paddingLeft: pageGutter(theme, screenSize),
  paddingRight: pageGutter(theme, screenSize),
  boxSizing: 'border-box',
  ...patternPageBackground(theme, screenSize),
}));

/** The page column (Figma: 280..1406, the in-app 1128 column). */
export const UnderstandColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space8,
  width: '100%',
  maxWidth: theme.sizing.appContentMaxWidth,
}));

/** Title + works pill over the subtitle; the banner floats over it. */
export const TitleGroup = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
}));

// Figma: 225x31 rx 9.5 on a selectedNavy hairline, Rubik 16.
export const WorksPill = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 31,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: 9.5,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.selectedNavy}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  boxSizing: 'border-box',
}));

// Figma (frame 3): a one-time overlay across the title, so it takes no space.
export const BannerOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto' },
});

export const ResultsBannerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space3,
  maxWidth: '100%',
  padding: `${theme.sizing.space1}px ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.success}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBodyBold,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
}));

/** Figma: three 366-wide cards ~14 apart at LARGE, stacked below. */
export const CardRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'stretch',
  gap: theme.sizing.space3,
  width: '100%',
  '& > *': { flex: '1 1 0', minWidth: 0 },
}));

// Figma: 366x544 rx 32, white with the dashboard card's soft shadow. The
// content sets the height; the row stretches the three to match.
export const MisconceptionCardSurface = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
  padding: theme.sizing.space6,
  borderRadius: theme.sizing.space6,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: dashboardCardShadow,
  boxSizing: 'border-box',
}));

/** Badge, title and student-count chip (Figma: ~6-10 between). */
export const CardHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space2,
}));

export const BadgeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

interface BadgeProps {
  isFocus: boolean;
}

// Figma: RECOMMENDED FOCUS is 215x36 rx10 brightBlue with white Poppins
// 16/600; ADDITIONAL MISCONCEPTION is 263x37 on a greyAccent hairline.
export const CardBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocus',
})<BadgeProps>(({ theme, isFocus }) => {
  const palette = theme.palette.designSystem;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 36,
    padding: `0 ${theme.sizing.space2}px`,
    borderRadius: tagRadius,
    backgroundColor: isFocus ? palette.foreground.brightBlue : 'transparent',
    border: isFocus ? 'none' : `${theme.borders.borderWidth}px solid ${palette.foreground.greyAccent}`,
    color: isFocus ? palette.surface.white : palette.surface.atlanticNavy,
    ...theme.typography.headingSm,
    fontWeight: isFocus ? 600 : 400,
    textTransform: 'uppercase',
    boxSizing: 'border-box',
  };
});

// Figma: h30 rx10 skyBlue, Poppins 16/500.
export const PrevalenceTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 30,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: tagRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  cursor: 'default',
}));

/** A small caps label over its text (RESPONSE EVIDENCE:, POSSIBLE EXPLANATION:). */
export const LabelledBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

export const BlockLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallBodyText,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textTransform: 'uppercase',
}));

// The evidence line opens the details modal, so it is a button styled as text.
export const EvidenceLink = styled('button')(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  '&:hover, &:focus-visible': { textDecoration: 'underline' },
}));

export const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizing.space1,
}));

interface CardButtonProps {
  isPrimary?: boolean;
}

// Figma: 149x50 rx25, Rubik 16/500 white — View details on accentBlue,
// Select on navyBlue.
export const CardButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isPrimary',
})<CardButtonProps>(({ theme, isPrimary }) => {
  const palette = theme.palette.designSystem;

  return {
    flex: '1 1 0',
    minWidth: 0,
    minHeight: pillHeight,
    borderRadius: pillHeight / 2,
    backgroundColor: isPrimary ? palette.background.navyBlue : palette.foreground.accentBlue,
    color: palette.surface.white,
    ...theme.typography.buttonLabel,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: palette.surface.atlanticNavy,
    },
  };
});

/** "Correct responses across the N Mix It Up questions" and its tiles. */
export const CorrectSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
}));

export const TileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizing.space10,
}));

// Figma: 95x101 rx 14.5, white on a greyAccent hairline; Q#, the percentage
// (Rubik 24), then "Correct" in correctGreen.
export const QuestionTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 95,
  minHeight: 101,
  borderRadius: 14.5,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.greyAccent}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  boxSizing: 'border-box',
  cursor: 'default',
}));

export const TilePercent = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  fontWeight: 400,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export type { ScreenSizeProps };
