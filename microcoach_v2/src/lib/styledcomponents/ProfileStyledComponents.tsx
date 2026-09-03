import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { pageGutter } from '../../components/ContentRow';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * Account Settings. Read off the 1921x1159 profile frame — the first
 * two-column screen in this flow, so it does not reuse SignUpColumn.
 */

const SIDEBAR_WIDTH = 325;
const FORM_WIDTH = 502;
const avatarRadius = 28;
const pillRadius = 18;

/**
 * The page's own column, in place of AppContentRow.
 *
 * This screen cannot use the shared 1128 column: the frame pins the navy card
 * to the page edge (x 79), and inside a centred 1128 column it would pin to
 * the column edge instead — x 396 at 1920. So the page runs full width and
 * takes the gutter directly, which is what then sets the card's inset.
 */
export const ProfilePage = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  width: '100%',
  paddingTop: theme.sizing.space11,
  paddingBottom: theme.sizing.space12,
  paddingLeft: pageGutter(theme, screenSize),
  paddingRight: pageGutter(theme, screenSize),
  boxSizing: 'border-box',
}));

/**
 * Figma: the navy card and the form column sit side by side at LARGE.
 *
 * central_v2's UserProfile arrangement (pages/UserProfile.tsx:299), in grid
 * rather than in Grid items. It runs three tracks — card, form, and an empty
 * one — because two would centre the *pair*, putting the form (and the title
 * inside it) left of the page's centre. The third track balances the first, so
 * the middle one lands on true centre; central_v2 spends an empty <Grid item />
 * on it, while a grid template gets it for nothing.
 *
 * minmax(0, ...) rather than a bare 1fr on the outer tracks: 1fr refuses to go
 * below its content, and 502 + two 325 cards does not fit at 1024, where LARGE
 * begins. The zero floor lets the tracks collapse so the row tightens instead
 * of overflowing sideways.
 */
export const ProfileLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) =>
  screenSize === ScreenSize.LARGE
    ? {
        display: 'grid',
        gridTemplateColumns: `minmax(0, 1fr) minmax(0, ${FORM_WIDTH}px) minmax(0, 1fr)`,
        columnGap: theme.sizing.space5,
        alignItems: 'start',
        width: '100%',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.sizing.space8,
        width: '100%',
        maxWidth: theme.sizing.appContentMaxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
);

// Figma: 325x891 rx16 in darkBlue. Height is left to the content rather than
// asserted — the frame's 891 is one canvas, not a rule.
export const ProfileSidebar = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space4,
  // Pinned to the start of its track rather than stretched across it, so the
  // page gutter is what holds it off the edge.
  justifySelf: 'start',
  width: '100%',
  maxWidth: screenSize === ScreenSize.LARGE ? SIDEBAR_WIDTH : '100%',
  padding: theme.sizing.space6,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.darkBlue,
  color: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

/**
 * Figma: 123x152, rx 28.6, behind a near-white 2.3px ring.
 *
 * The avatar art carries its own rectangular background, so this clips it
 * rather than sitting behind it. avatarPlate stays as the fill because it is
 * that art's own background colour — it shows through while the image loads
 * and if it ever fails, so the plate never flashes navy-on-navy.
 */
export const ProfileAvatar = styled(Box)(({ theme }) => ({
  width: 123,
  height: 152,
  overflow: 'hidden',
  borderRadius: avatarRadius,
  backgroundColor: theme.palette.designSystem.surface.avatarPlate,
  border: `2px solid ${theme.palette.designSystem.background.offWhite}`,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

// The art is 86x106 against the plate's 123x152 — the same 0.81 aspect, so
// cover crops nothing in practice and guards the case where it ever differs.
export const ProfileAvatarImage = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

/** Figma: 131x36 rx18 accentBlue, under the sidebar name. */
export const ProfileNamePill = styled(Box)(({ theme }) => ({
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

/**
 * A label/value pair in the sidebar. The frame centres both on the card's
 * axis; a plain full-width block would left-align them out of the column the
 * rest of the sidebar sits on.
 */
export const ProfileStat = styled(Box)({
  width: '100%',
  textAlign: 'center',
});

/*
 * Figma draws Edit Picture and Change Password at full strength even though
 * neither has anything behind it. MUI's `disabled` greys the fill and the
 * label, so these take `isInert` instead: the control keeps its painted state
 * and the call site says so with aria-disabled rather than the DOM attribute,
 * which would also drop it out of the tab order.
 */
const inertProp = (prop: PropertyKey) => prop !== 'isInert';

interface InertProps {
  isInert?: boolean;
}

/** Figma: 97x36 rx18 skyBlue with navy label. */
export const EditPictureChip = styled(Button, {
  shouldForwardProp: inertProp,
})<InertProps>(({ theme, isInert }) => ({
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
  fontWeight: 400,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  ...(isInert ? { cursor: 'default' } : null),
  '&:hover': {
    backgroundColor: isInert
      ? theme.palette.designSystem.surface.skyBlue
      : theme.palette.designSystem.foreground.lightBlue,
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

// Figma aligns the title's cap height with the top of the navy card and
// centres it on the form column, not on the page — so it lives inside
// ProfileForm rather than above the two-column row.
export const ProfileHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.displayBold,
  color: theme.palette.designSystem.surface.darkBlue,
  textAlign: 'center',
}));

export const ProfileSectionTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  color: theme.palette.designSystem.foreground.slateNavy,
  textAlign: 'center',
}));

/** Figma: 126x36 (Edit Information) and 137x36 (Change Password). */
export const ProfileAction = styled(Button, {
  shouldForwardProp: inertProp,
})<InertProps>(({ theme, isInert }) => ({
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
  ...(isInert ? { cursor: 'default' } : null),
  '&:hover': {
    backgroundColor: isInert
      ? theme.palette.designSystem.foreground.accentBlue
      : theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export type { ScreenSizeProps };
