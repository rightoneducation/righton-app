import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ScreenSize } from '../lib/MicroCoachModels';

/**
 * Resolves the current breakpoint band once, so layout decisions happen in JS
 * rather than CSS media queries (central_v2's approach). Bands match its theme:
 * SMALL < 700 | MEDIUM 700-1023 | LARGE >= 1024.
 *
 * central_v2 duplicates this block in both AppSwitch and AppContainer; keeping
 * it in one hook avoids the two copies drifting.
 */
// eslint-disable-next-line import/prefer-default-export
export function useScreenSize(): ScreenSize {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
}
