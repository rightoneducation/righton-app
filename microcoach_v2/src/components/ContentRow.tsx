import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ScreenSize } from '../lib/MicroCoachModels';

interface ContentRowProps {
  screenSize: ScreenSize;
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
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<ContentRowProps>(({ theme, screenSize }) => {
  const gutter =
    screenSize === ScreenSize.LARGE // eslint-disable-line
      ? theme.sizing.space5
      : screenSize === ScreenSize.MEDIUM
        ? theme.sizing.space8
        : theme.sizing.space4;

  return {
    width: '100%',
    maxWidth:
      screenSize === ScreenSize.LARGE
        ? theme.sizing.contentMaxWidth + 2 * gutter
        : '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: gutter,
    paddingRight: gutter,
    // No CssBaseline border-box reset here: padding must not add to the column.
    boxSizing: 'border-box',
  };
});

export default ContentRow;
