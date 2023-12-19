import React from 'react';
import { ApiClient } from '@righton/networking';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import PlaceholderContentArea from '../components/PlaceholderContentArea';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  console.log(apiClient); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderBackgroundStyled />
      <HeaderStackContainerStyled>
        <Typography variant="h1">{t('gamesession.placeholder')}</Typography>
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <PlaceholderContentArea />
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}
