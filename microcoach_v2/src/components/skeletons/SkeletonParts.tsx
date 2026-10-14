import React from 'react';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import { SxProps, Theme } from '@mui/material/styles';

/*
 * The pieces every loading skeleton is drawn from, after the reflect-ui
 * branch's ReviewSkeleton: wave Skeletons for lines of text, rounded pills for
 * badges, chips and buttons, and cards that fade in one after another.
 */

type Size = number | string;

/** One line of text, at the height of the line it stands in for. */
export function SkeletonLine({
  width = '100%',
  height = 22,
  sx,
}: {
  width?: Size;
  height?: number;
  sx?: SxProps<Theme>;
}) {
  return <Skeleton animation="wave" variant="text" width={width} height={height} sx={sx} />;
}

/** A badge, chip or button: a rounded block at its real size and radius. */
export function SkeletonPill({
  width,
  height,
  radius = height / 2,
  sx,
}: {
  width?: Size;
  height: number;
  radius?: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <Skeleton
      animation="wave"
      variant="rounded"
      width={width}
      height={height}
      sx={[{ borderRadius: `${radius}px`, flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

/** Several lines of a paragraph, the last one short. */
export function SkeletonParagraph({ lines, height = 20 }: { lines: number; height?: number }) {
  return (
    <>
      {Array.from({ length: lines }, (unused, index) => (
        <SkeletonLine
          // Placeholder lines have no identity beyond their position.
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          height={height}
          width={index === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </>
  );
}

/**
 * Fades a card in, each a little after the one before (800ms, 150ms apart).
 * The child takes the transition itself (no wrapper), so a card that is a
 * grid or subgrid item stays a direct child of its row.
 */
export function SkeletonFade({
  index,
  children,
}: {
  index: number;
  children: React.ReactElement;
}) {
  return (
    <Fade in appear timeout={800} style={{ transitionDelay: `${150 * index}ms` }}>
      {children}
    </Fade>
  );
}
