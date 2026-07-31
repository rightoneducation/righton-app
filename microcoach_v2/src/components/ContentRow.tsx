import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ScreenSize } from '../lib/MicroCoachModels';

interface ContentRowProps {
  screenSize: ScreenSize;
  /**
   * Body sections sit in a 1370 column at 1920 while the header and footer use
   * 1400 (Figma insets them to x 275..1645 and x 260..1660 respectively). Below
   * LARGE both share the same gutter, so this only bites at desktop.
   */
  narrow?: boolean;
}

/**
 * Owns the page gutter, so the header, the footer and every landing section
 * share one column while their backgrounds run full-bleed.
 *
 * Figma gutters: 20 at 393, 48 at 744, and a centred 1400 column at 1920.
 * At LARGE the maxWidth includes the padding so the inner width lands on
 * exactly 1400; below that the content is full-bleed inside the gutter.
 */
const ContentRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'narrow',
})<ContentRowProps>(({ theme, screenSize, narrow }) => {
  const gutter =
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? theme.sizing.space5
      : screenSize === ScreenSize.MEDIUM
        ? theme.sizing.space8
        : theme.sizing.space4;

  const column = narrow
    ? theme.sizing.sectionMaxWidth
    : theme.sizing.contentMaxWidth;

  return {
    width: '100%',
    maxWidth: screenSize === ScreenSize.LARGE ? column + 2 * gutter : '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: gutter,
    paddingRight: gutter,
    // No CssBaseline border-box reset here: padding must not add to the column.
    boxSizing: 'border-box',
  };
});

export default ContentRow;
