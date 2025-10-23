import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import { ScreenSize, CardType } from '../../lib/CentralModels';
import DetailedQuestionCardBase from '../cards/detailedquestion/DetailedQuestionCardBase';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import OwnerTag from '../profile/OwnerTag';
import {
  DetailedQuestionContainer,
  CardContainer,
  SubCardGridItem,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface ViewQuestionCardUnifiedProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate;
  handleRemoveQuestion: () => void;
  isViewGame: boolean;
  isCreateGame?: boolean;
}

export default function ViewQuestionCardUnified({
  screenSize,
  question,
  handleRemoveQuestion,
  isViewGame,
  isCreateGame,
}: ViewQuestionCardUnifiedProps) {
  const theme = useTheme();

  return (
    <CardContainer sx={{ overflowY: 'visible', paddingTop: '0px' }}>
      <DetailedQuestionCardBase
        isCreateGame={isCreateGame}
        handleRemoveQuestion={handleRemoveQuestion}
        dropShadow
        screenSize={screenSize}
        question={question}
      />
    </CardContainer>
  );
}
