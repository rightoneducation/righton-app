import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { SxProps, Theme } from '@mui/material/styles';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  /** Applied to the <img>. Give it the dimensions the slot expects. */
  sx?: SxProps<Theme>;
  /** Matches the image's own radius so the placeholder shares its shape. */
  borderRadius?: number | string;
  className?: string;
}

/**
 * Shows a Skeleton in an image's place until it has loaded.
 *
 * The <img> stays mounted the whole time and is only faded in — it is *not*
 * conditionally rendered. An unmounted <img> is never requested by the browser,
 * so `onLoad` would never fire and the skeleton would be permanent. Keeping it
 * mounted also means the request starts as soon as this component mounts.
 *
 * `onError` settles too, so a broken URL shows the (empty) image slot rather
 * than a skeleton that shimmers forever.
 */
export default function ImageWithSkeleton({
  src,
  alt,
  sx,
  borderRadius,
  className,
}: ImageWithSkeletonProps) {
  const [settled, setSettled] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: '100%' }} className={className}>
      {!settled && (
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius,
          }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setSettled(true)}
        onError={() => setSettled(true)}
        sx={{
          display: 'block',
          opacity: settled ? 1 : 0,
          transition: 'opacity 200ms ease-in',
          ...sx,
        }}
      />
    </Box>
  );
}
