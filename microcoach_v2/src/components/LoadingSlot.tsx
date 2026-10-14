import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingSlotProps {
  isLoading: boolean;
  // The height the loaded content will take, so nothing below it moves when
  // the placeholder is swapped out.
  minHeight: number;
  label: string;
  // The shape of what is loading (components/skeletons). Without one, a
  // spinner holds the place.
  skeleton?: React.ReactNode;
  children?: React.ReactNode;
}

/** Holds the place of the one part of a screen still waiting on a query. */
export default function LoadingSlot({
  isLoading,
  minHeight,
  label,
  skeleton,
  children,
}: LoadingSlotProps) {
  // The fragment gives a component return type to whatever children are,
  // which may be a single node, several, or none.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <>{children}</>;

  if (skeleton) {
    return (
      <Box role="status" aria-busy aria-label={label} sx={{ width: '100%', minHeight }}>
        {skeleton}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight,
      }}
    >
      <CircularProgress
        size={24}
        aria-label={label}
        sx={{ color: 'designSystem.foreground.accentBlue' }}
      />
    </Box>
  );
}
