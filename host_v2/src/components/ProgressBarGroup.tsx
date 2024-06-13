import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ProgressBar from './ProgressBar';

const PBContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '700px',
  height: '36px',
  gap: '8px',
  padding: '0px 16px 0px 16px',
  justifyContent: 'center',
  alignItems: 'center',
});

const LabelTypography = styled(Typography)({
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Helvetica',
  fontSize: '16px',
  fontWeight: 'bold',
  zIndex: '1',
  lineHeight: '18px',
});

interface ProgressBarProps {
  teamsLength: number;
}

function ProgressBarGroup({ teamsLength }: ProgressBarProps) {
  const theme = useTheme();
  return (
    <PBContainer>
      <LabelTypography style={{color: theme.palette.primary.darkBlue}}>Players who have answered</LabelTypography>
      <ProgressBar inputNum={15} totalNum={20}/>
    </PBContainer>
  );
}

export default ProgressBarGroup;


