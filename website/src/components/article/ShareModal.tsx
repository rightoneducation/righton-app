import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import CloseIcon from '../../images/shareModalClose.svg';
import { ScreenSize } from '../../lib/WebsiteModels';

interface ShareModalProps {
  screenSize: ScreenSize;
  handleCloseClick: () => void;
}

export function ShareModal ({ // eslint-disable-line
  screenSize,
  handleCloseClick,
}: ShareModalProps) {
  return (
    <Paper
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#22499C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '495px',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        style={{
          color: '#fff',
          fontSize: '24px',
          lineHeight: '24px',
          fontWeight: '600',
          fontFamily: 'Poppins',
        }}
      >
        Link copied to clipboard.
      </Typography>
      <Box
        style={{
          cursor: 'pointer',
        }}
        onClick={handleCloseClick}
      >
        <img src={CloseIcon} alt="Close Modal" />
      </Box>
    </Paper>
  );
}