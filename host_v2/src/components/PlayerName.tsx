import React from 'react';
import { Tooltip, Typography, TypographyProps } from '@mui/material';

// character budget for a player name before it's truncated. tuned for the narrowest column
// (the tablet/mobile card), so wider screens truncate a little earlier than they strictly
// need to — the tradeoff for a pure length check with no measurement.
const maxNameChars = 25;

// same idiom as HintsGraph/CustomLabel's truncateLabel: cut to the budget, drop any trailing
// space the cut exposed, then append the ellipsis.
export const truncateName = (name: string) =>
  name.length > maxNameChars ? `${name.slice(0, maxNameChars).trimEnd()}...` : name;

interface PlayerNameProps {
  name: string;
  variant?: TypographyProps['variant'];
  // each screen passes its own styled Typography (the leaderboard's top-five rows use an 18px
  // variant, the rest use the warm-base one), so the styling stays with the screen.
  TypographyComponent?: React.ElementType;
  style?: React.CSSProperties;
}

// player name with ellipsis truncation and a hover tooltip carrying the full name. the
// tooltip is desktop-only by design: no tap-to-reveal on touch.
function PlayerName({
  name,
  variant = 'answerOption',
  TypographyComponent = Typography,
  style,
}: PlayerNameProps) {
  const isTruncated = name.length > maxNameChars;

  return (
    <Tooltip
      title={name}
      placement="top"
      arrow
      disableHoverListener={!isTruncated}
      disableFocusListener={!isTruncated}
      disableTouchListener
    >
      {/* the CSS ellipsis is a backstop for glyph width: the length check can't know that 25
          wide characters overflow where 25 narrow ones fit. needs minWidth 0 here and on the
          flex ancestors, or the row overflows instead of truncating. */}
      <TypographyComponent
        variant={variant}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          // the only interaction here is the hover tooltip, so keep the arrow rather than
          // the I-beam a text node would otherwise get
          cursor: 'default',
          ...style,
        }}
      >
        {truncateName(name)}
      </TypographyComponent>
    </Tooltip>
  );
}

export default PlayerName;
