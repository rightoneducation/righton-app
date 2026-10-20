import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import './MisconceptionCarousel.css';

// Cards that fit in the page column side by side, as in the grid used for three.
const CARDS_IN_VIEW = 3;
// How much of the next card shows past the column, as a share of a card.
const PEEK_SHARE = 0.2;
// A drag this far through a card moves to the next position; Swiper's default is
// half a card, which made the one-card move feel heavy.
const LONG_SWIPE_RATIO = 0.1;

interface Geometry {
  /** How far the strip reaches past the column on each side. */
  before: number;
  after: number;
  cardWidth: number;
}

const DotsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.sizing.space1,
  paddingTop: theme.sizing.space4,
}));

const Dot = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isLit',
})<{ isLit: boolean }>(({ theme, isLit }) => ({
  width: 8,
  height: 8,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: isLit
    ? theme.palette.designSystem.surface.atlanticNavy
    : theme.palette.designSystem.foreground.greyAccent,
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
    outlineOffset: 2,
  },
}));

interface MisconceptionCarouselProps {
  children: React.ReactNode;
}

/**
 * Review's cards at LARGE when there are more than three (the Highest Frequency
 * misconception carried forward as a fourth). Central's carousel layout: the strip
 * reaches a little past the column, so a fifth of the next card shows there, which
 * is what shows it scrolls. Card #1 starts aligned with the page column.
 *
 * Cards are the width the three-card grid gives them, (column − 2 gaps) / 3, so the
 * scroll ends exactly on card 2's edge: with four cards the strip rests in two
 * places, cards 1–3 and 2–4. (At a fixed 366 the end fell 2px past that edge and
 * Swiper added a third stop 2px away, so one swipe went nowhere.)
 *
 * One dot per resting place (two with four cards: cards 1–3 and 2–4).
 */
export default function MisconceptionCarousel({ children }: MisconceptionCarouselProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const gap = theme.sizing.space3;
  const cards = React.Children.toArray(children);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  // The first card in full view.
  const [firstInView, setFirstInView] = useState(0);

  // The column stays put when the window resizes but moves sideways, so both the
  // window and the column are watched. The peek never reaches past the window, or
  // the page would scroll sideways.
  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return undefined;
    const measure = () => {
      const rect = column.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      const cardWidth = (rect.width - gap * (CARDS_IN_VIEW - 1)) / CARDS_IN_VIEW;
      const peek = gap + PEEK_SHARE * cardWidth;
      setGeometry({
        before: Math.max(0, Math.min(peek, rect.left)),
        after: Math.max(0, Math.min(peek, viewport - rect.right)),
        cardWidth,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [gap]);

  // Slide widths and offsets come from the measurement, which Swiper does not watch.
  useLayoutEffect(() => {
    swiper?.update();
  }, [swiper, geometry]);

  const lastStart = Math.max(0, cards.length - CARDS_IN_VIEW);

  // Room above and below for the card shadow, which the strip would otherwise clip.
  const inset = theme.sizing.space2;
  return (
    <Box ref={columnRef} sx={{ width: '100%' }}>
      {geometry && (
        <>
          <Swiper
            className="misconception-swiper"
            onSwiper={setSwiper}
            onSnapIndexChange={(s) => setFirstInView(Math.min(s.snapIndex, lastStart))}
            slidesPerView="auto"
            spaceBetween={gap}
            slidesOffsetBefore={geometry.before}
            slidesOffsetAfter={geometry.after}
            longSwipesRatio={LONG_SWIPE_RATIO}
            grabCursor
            style={{
              width: `calc(100% + ${geometry.before + geometry.after}px)`,
              marginLeft: -geometry.before,
              padding: `${inset}px 0`,
              marginTop: -inset,
              marginBottom: -inset,
            }}
          >
            {cards.map((child) => (
              <SwiperSlide
                key={(child as React.ReactElement).key}
                style={{ width: geometry.cardWidth }}
              >
                {child}
              </SwiperSlide>
            ))}
          </Swiper>
          <DotsRow>
            {Array.from({ length: lastStart + 1 }, (_, start) => (
              <Dot
                key={start}
                type="button"
                isLit={start === firstInView}
                aria-label={t('review.showMisconceptions', {
                  from: start + 1,
                  to: start + CARDS_IN_VIEW,
                  count: cards.length,
                })}
                onClick={() => swiper?.slideTo(start)}
              />
            ))}
          </DotsRow>
        </>
      )}
    </Box>
  );
}
