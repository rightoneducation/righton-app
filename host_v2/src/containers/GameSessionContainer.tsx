import React from 'react';
import { ApiClient } from '@righton/networking';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderBackgroundStyled from '../lib/styledcomponents/layout/HeaderBackgroundStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer(
  { apiClient } : GameInProgressContainerProps
) {
  console.log(apiClient);
  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    > 
      <HeaderBackgroundStyled />
      <HeaderStackContainerStyled>
        Sup
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
      </BodyStackContainerStyled>
    </StackContainerStyled>
  );
}

