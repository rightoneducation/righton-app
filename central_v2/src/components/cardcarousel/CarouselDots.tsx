import React from 'react';
import { styled } from '@mui/material/styles';

/**
 * Replacement for Swiper's Pagination bullets.
 *
 * Swiper renders one bullet per entry in `snapGrid`, but `centeredSlidesBounds`
 * clamps the outermost entries onto shared positions -- at every viewport the
 * grid holds 7 entries and only 5 distinct places to be. The duplicates are
 * unreachable: the active index always resolves to the first match, so the
 * second bullet could never highlight and the last one could never be scrolled
 * to. Dots here are keyed to distinct positions instead, so every one works.
 *
 * Styling matches the bullets it replaces: 20x6 pills, 2px radius, 4px gap.
 */

const DotsRow = styled('div')(({ theme }) => ({
  height: `${theme.sizing.mdPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  zIndex: 1,
}));

const Dot = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive, theme }) => ({
  width: '20px',
  height: '6px',
  padding: 0,
  border: 'none',
  borderRadius: '2px',
  cursor: 'pointer',
  // the active token is a linear-gradient, so it has to be a background
  background: isActive
    ? theme.palette.primary.highlightGradient
    : theme.palette.primary.darkGrey,
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.darkBlue}`,
    outlineOffset: '2px',
  },
}));

interface CarouselDotsProps {
  /** one entry per distinct scroll position, holding the slide index to jump to */
  stops: number[];
  activeStop: number;
  onSelect: (slideIndex: number) => void;
}

export default function CarouselDots({
  stops,
  activeStop,
  onSelect,
}: CarouselDotsProps) {
  // a single stop means nothing to navigate between
  if (stops.length < 2) return <DotsRow />;
  return (
    <DotsRow>
      {stops.map((slideIndex, dotIndex) => (
        <Dot
          key={`carousel-dot-${slideIndex}`}
          type="button"
          isActive={dotIndex === activeStop}
          aria-label={`Go to position ${dotIndex + 1} of ${stops.length}`}
          aria-current={dotIndex === activeStop}
          onClick={() => onSelect(slideIndex)}
        />
      ))}
    </DotsRow>
  );
}
