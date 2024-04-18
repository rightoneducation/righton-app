import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';



interface ProgressBarProps {
    teamsLength: number;
  }
const PBContainer = styled(Box)({
  display: 'flex',
  width: '327px',
  height: '36px',
  gap: '8px',
  padding: '0px 16px 0px 16px',
  justifyContent: 'center',
  alignItems: 'center',
})
const PBTotalTypography = styled(Typography)({
    width: '16px',
    height: '36px',
    color: 'white',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '36px',
});
const PBDescriptionTypography = styled(Typography)({
  width: '160px',
  height: '19px',
  font: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '18.96px',
  color: 'white',
});

function ProgressBar({ teamsLength }: ProgressBarProps) {
  return (
    <PBContainer>
      <PBTotalTypography>{teamsLength} </PBTotalTypography>
      <PBDescriptionTypography>players have joined</PBDescriptionTypography>
    </PBContainer>
  );
}

export default ProgressBar;
