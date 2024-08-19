import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Theme from '../lib/Theme';

const ProgressTopContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  gap: '10px',
  width: '100%',
});

const ProgressBarContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  gap: '10px',
  width: '100%',
});

const StyledProgressBar = styled(LinearProgress)({
  position: 'relative',
  top: '0',
  left: '0',
  height: '18px',
  width: '100%',
  borderRadius: '3px',
});

const CurrentNumberTypography = styled(Typography)({
  position: 'absolute',
  top: '0',
  left: '0',
  textAlign: 'right',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  fontWeight: 'bold',
  zIndex: '1',
  lineHeight: '18px',
  color: 'white'
}); 

const TotalNumberTypography = styled(Typography)({
  fontSize: '12px',
  lineHeight: '12px',
  fontFamily: 'Helvetica',
  fontWeight: 'bold',
  margin: 'auto',
});

interface LinearProgressBarProps {
  inputNum: number;
  totalNum: number;
}
export default function ProgressBar({ inputNum, totalNum }: LinearProgressBarProps) {
  const theme = useTheme();
  const progressPercent = 
    inputNum !== 0 ? (inputNum / totalNum) * 100 : 0;

  return (
    <ProgressTopContainer>
      <ProgressBarContainer>
        <StyledProgressBar
          variant="determinate"
          sx={{
            backgroundColor: theme.palette.primary.progressBarBackgroundColor,
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.progressBarColor
            }
          }}
          value={progressPercent}
        />
        <CurrentNumberTypography style={{width: `${progressPercent - 2}%`}}>
          {inputNum}
        </CurrentNumberTypography>
      </ProgressBarContainer>
      <TotalNumberTypography style={{color: theme.palette.primary.darkBlue}}>{totalNum}</TotalNumberTypography>
    </ProgressTopContainer>
  );
}