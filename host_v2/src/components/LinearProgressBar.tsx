import React from 'react';
import { styled } from '@mui/material/styles';
import {LinearProgress, Box, Typography} from '@mui/material';

interface LinearProgressBarProps {
  inputNum: number;
  totalNum: number;
}

const BarGroupStyled = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  gap: '10px',
  width: '100%',
});

const TotalNumStyled = styled(Typography)({
  fontSize: '12px',
  lineHeight: '12px',
  color: 'white',
  fontFamily: 'Helvetica',
  fontWeight: 'bold',
  margin: 'auto',
});

const BarContainerStyled = styled(Box)({
  position: 'relative',
  width: '100%',
});


const LinearProgressBarStyled = styled(LinearProgress)(({ theme }) => ({
  position: 'relative',
  top: '0',
  left: '0',
  height: '18px',
  width: '100%',
  borderRadius: '3px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  '& .MuiLinearProgress-bar': {
    background: `white`,
  },
}));

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({ inputNum, totalNum }) => {
  const progressPercent = inputNum !== 0 ? (inputNum / totalNum) * 100 : 0;

  return (
    <BarGroupStyled>
      <BarContainerStyled>
        <LinearProgressBarStyled
          variant="determinate"
          value={progressPercent}
        />
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${progressPercent - 2}%`,
            textAlign: 'right',
            fontFamily: 'Helvetica',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1,
            lineHeight: '18px',
          }}
        >
          {inputNum}
        </div>
      </BarContainerStyled>
      <TotalNumStyled>{totalNum}</TotalNumStyled>
    </BarGroupStyled>
  );
}

export default LinearProgressBar;
