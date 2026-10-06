import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingSlotProps {
  isLoading: boolean;
  // The height the loaded content will take, so nothing below it moves when
  // the spinner is swapped out.
  minHeight: number;
  label: string;
  children?: React.ReactNode;
}

/** A spinner holding the place of the one part of a screen still waiting on a query. */
export default function LoadingSlot({
  isLoading,
  minHeight,
  label,
  children,
}: LoadingSlotProps) {
  // The fragment gives a component return type to whatever children are,
  // which may be a single node, several, or none.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <>{children}</>;

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
