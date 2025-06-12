import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import errorCardIcon from '../../../images/errorCardIcon.svg';
import { ScreenSize } from '../../../lib/CentralModels';

const CreateGameErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  paddingLeft: '16px',
  paddingRight: '16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  border: `2px solid ${theme.palette.primary.errorBorder}`,
  background: `${theme.palette.primary.uploadLightGrey}`,
  borderBox: 'box-sizing',
}));

type TErrorTextProps = {
  screenSize: ScreenSize;
};

const ErrorTextContainer = styled(Box)<TErrorTextProps>(
  ({ theme, screenSize }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height:
      screenSize === ScreenSize.LARGE || screenSize === ScreenSize.MEDIUM
        ? '56px'
        : '123px',
  }),
);

const ErrorHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: `${theme.palette.primary.errorColor}`,
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: `#5A5A5A`,
}));

const ErrorSVG = styled('img')(({ theme }) => ({
  cursor: 'pointer',
  height: '35px',
  width: '35px',
}));

interface ICreateGameErrorBox {
  screenSize: ScreenSize;
}

export default function CreateGameErrorBox({
  screenSize,
}: ICreateGameErrorBox) {
  return (
    <CreateGameErrorContainer>
      <ErrorSVG src={errorCardIcon} alt="errorimage" />
      <ErrorTextContainer screenSize={screenSize}>
        <ErrorHeader>Looks like you missed something!</ErrorHeader>
        <ErrorText>
          Please fill in all required fields with valid information.
        </ErrorText>
      </ErrorTextContainer>
    </CreateGameErrorContainer>
  );
}
