import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  styled,
} from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const BaseCardStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: `${theme.sizing.mdPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
}));

export const TitleBarStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

export const QuestionTitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: '#000',
}));

export const RadioContainerStyled = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}));

type RadioLabelProps = {
  isSelected: boolean;
};

export const RadioLabelStyled = styled(FormControlLabel)<RadioLabelProps>(
  ({ theme, isSelected }) => ({
    cursor: 'default',
    margin: 0,
    color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)',
    '& .MuiTypography-root': {
      color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.2)',
    },
  }),
);

export const RadioStyled = styled(Radio)(({ theme }) => ({
  cursor: 'default',
  color: 'rgba(0, 0, 0, 0.2)',
  '&.Mui-checked': {
    color: `${theme.palette.primary.mediumBlue}`,
  },
}));

interface ContentContainerProps {
  screenSize: ScreenSize;
}

export const ContentContainerStyled = styled(Box)<ContentContainerProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: screenSize === ScreenSize.SMALL ? '100%' : '100%',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

export const ImageStyled = styled('img')({
  width: '100%',
  height: '175px',
  objectFit: 'cover',
});

export const ContentRightContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

export const TextContainerStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  flexGrow: 1,
  background: `${theme.palette.primary.lightGrey}`,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  padding: `${theme.sizing.xSmPadding}px`,
}));

export const CCSSIndicator = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: `${theme.sizing.mdPadding}px`,
  padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.xSmPadding}px`,
  gap: `${theme.sizing.xxSmPadding}px`,
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '16.59px',
  textAlign: 'center',
  boxShadow: '0px 3px 12px 0px #95002366',
  zIndex: 2,
  boxSizing: 'border-box',
  minWidth: '20px',
  display: 'flex',
  alignItems: 'center',
}));

export const AnswerIndicator = styled(Box)(({ theme }) => ({
  width: '100%',
  height: `${theme.sizing.xLgPadding}px`,
  borderRadius: '20px',
  background: `${theme.palette.primary.lightGrey}`,
  paddingTop: `10px`,
  paddingBottom: '10px',
  paddingLeft: `12px`,
  paddingRight: `12px`,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-box',
}));
