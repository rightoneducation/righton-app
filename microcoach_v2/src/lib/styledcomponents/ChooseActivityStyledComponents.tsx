import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

export const ACTIVITY_CARD_GAP = 28;

const backRadius = 20;
const chipRadius = 13;
const actionRadius = 18;

export const BackButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minWidth: 241,
  padding: `${theme.sizing.space1}px ${theme.sizing.space4}px`,
  borderRadius: backRadius,
  backgroundColor: 'transparent',
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
  },
}));

export const ContextBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: theme.sizing.sectionRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  boxSizing: 'border-box',
}));

interface SelectedProps {
  isSelected: boolean;
}

const noScreenSizeOrSelected = (prop: PropertyKey) =>
  noScreenSize(prop) && prop !== 'isSelected';

export const ActivityCard = styled(Paper, {
  shouldForwardProp: noScreenSizeOrSelected,
})<ScreenSizeProps & SelectedProps>(({ theme, screenSize, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: theme.sizing.space2,
  minHeight: screenSize === ScreenSize.LARGE ? 337 : undefined,
  padding: theme.sizing.space5,
  borderRadius: theme.sizing.sectionRadius,
  backgroundColor: isSelected
    ? theme.palette.designSystem.surface.skyBlue
    : theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  boxSizing: 'border-box',
  // Paper only transitions box-shadow, so its fill would snap while the button
  // inside eases over duration.short. Match the button and keep Paper's own
  // box-shadow transition, which this property would otherwise replace.
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
}));

export const DurationChip = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.placeholderGrey,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const GroupingChip = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const MetaSeparator = styled(Box)(({ theme }) => ({
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.microLabel,
  userSelect: 'none',
}));

export type CardActionTone = 'primary' | 'secondary' | 'disabled';

interface CardActionProps {
  tone: CardActionTone;
}

export const CardAction = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<CardActionProps>(({ theme, tone }) => {
  const palette = theme.palette.designSystem;
  const background = {
    primary: palette.background.navyBlue,
    secondary: palette.foreground.accentBlue,
    disabled: palette.surface.neutralGray,
  };

  return {
    flex: '1 1 0',
    minWidth: 0,
    height: 36,
    padding: `0 ${theme.sizing.space2}px`,
    borderRadius: actionRadius,
    backgroundColor: background[tone],
    border:
      tone === 'disabled'
        ? `${theme.borders.borderWidth}px solid ${palette.foreground.disabledStroke}`
        : 'none',
    color:
      tone === 'disabled'
        ? palette.surface.atlanticNavy
        : palette.surface.white,
    ...theme.typography.buttonLabelSm,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor:
        tone === 'disabled'
          ? background.disabled
          : palette.surface.atlanticNavy,
    },
  };
});

export const CardActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.sizing.space2,
  marginTop: 'auto',
}));

export type { ScreenSizeProps };
