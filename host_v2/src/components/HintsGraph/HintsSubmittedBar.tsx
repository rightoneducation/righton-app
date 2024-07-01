import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import StyledHintsLinearProgress from '../../lib/styledcomponents/graphs/StyledHintsLinearProgress';

const HintsBarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.sizing.xSmPadding,
}));

const TypographyTotalNum = styled(Typography)({
  fontSize: '12px',
  lineHeight: '12px',
  color: 'white',
  fontFamily: 'Helvetica',
  fontWeight: 'bold',
  margin: 'auto',
})

const InputNum = styled(Typography)(({ theme, progressPercent }) => ({
  position: 'absolute',
  top: '0',
  left: `${progressPercent - 3}%`,
  zIndex: 1,
  fontSize: '12px',
  fontWeight: '400',
  fontFamily: 'Rubik',
  color: theme.palette.primary.main,
  paddingLeft: theme.sizing.xSmPadding
}));

interface HintsSubmittedBarProps {
  inputNum: number;
  totalNum: number;
}

export default function HintsSubmittedBar ({ inputNum, totalNum }: HintsSubmittedBarProps) {
  const theme = useTheme();
  const progressPercent: number = inputNum !== 0 ? (inputNum / totalNum) * 100 : 0;

  return (
      <HintsBarContainer>
        <StyledHintsLinearProgress
          variant="determinate"
          classes={{
            barColorPrimary: theme.palette.primary.main,
          }}
          value={progressPercent}
        />
        { inputNum !== totalNum &&
          <InputNum progressPercent={progressPercent}>
            {inputNum}
          </InputNum>
        }
      <TypographyTotalNum>{totalNum}</TypographyTotalNum>
      </HintsBarContainer>
  );
}