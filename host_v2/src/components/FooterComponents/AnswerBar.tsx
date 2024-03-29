import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import BarGroup from '../../lib/styledcomponents/footer/BarGroup';
import StyledLinearProgress from '../../lib/styledcomponents/footer/StyledLinearProgress';
import InputNum from '../../lib/styledcomponents/footer/InputNum';

interface AnswerBarProps {
  inputNum: number;
  totalNum: number;
}

export default function AnswerBar({ inputNum, totalNum }: AnswerBarProps) {
  const progressPercent = inputNum !== 0 ? (inputNum / totalNum) * 100 : 0;

  const BarContainer = styled(Box)({
    position: 'relative',
    width: '100%',
  });

  return (
    <BarGroup>
      <BarContainer>
        <StyledLinearProgress variant="determinate" value={progressPercent} />
        <InputNum progressPercent={progressPercent}>{inputNum}</InputNum>
      </BarContainer>
      <Typography
        variant="h4"
        style={{ fontSize: '12px', fontWeight: '400', fontFamily: 'Rubik' }}
      >
        {totalNum}
      </Typography>
    </BarGroup>
  );
}
