import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate, CentralQuestionTemplateInput } from '@righton/networking';
import { ScreenSize, CardType } from '../../lib/CentralModels';
import ViewDetailedUnifiedQuestionCardBase from './ViewUnifiedDetailedQuestionCardBase';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import OwnerTag from '../profile/OwnerTag';
import {
  DetailedQuestionContainer,
  CardContainer,
  SubCardGridItem,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface ViewQuestionCardUnifiedProps {
  screenSize: ScreenSize;
  questionTemplate: IQuestionTemplate;
  handleRemoveQuestion: () => void;
  isViewGame: boolean;
  isCreateGame?: boolean;
}

export default function ViewQuestionCardUnified({
  screenSize,
  questionTemplate,
  handleRemoveQuestion,
  isViewGame,
  isCreateGame,
}: ViewQuestionCardUnifiedProps) {
  const theme = useTheme();

  return (
    <CardContainer sx={{ overflowY: 'visible', paddingTop: '0px'}}>
      <ViewDetailedUnifiedQuestionCardBase
        isCreateGame={isCreateGame}
        handleRemoveQuestion={handleRemoveQuestion}
        dropShadow
        screenSize={screenSize}
        questionTemplate={questionTemplate}
      />
    </CardContainer>
  );
}
