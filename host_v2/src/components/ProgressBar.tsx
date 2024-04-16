import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';



interface ProgressBarProps {
    teamsLength: number;
  }

const PBTypography = styled(Typography)({
    color: 'white',
});

function ProgressBar({ teamsLength }: ProgressBarProps) {
  return (
    <PBTypography>PROGRESS BAR HERE - {teamsLength} </PBTypography>
  );
}

export default ProgressBar;
