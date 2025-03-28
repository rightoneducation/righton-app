import { Box, CircularProgress } from '@mui/material';
import { IExplanationToSave } from '../lib/Models';
import { EmptyExplanationCardContainer, AllExplanationCardsContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { PlaceholderHeaderStyled, PlaceholderBodyStyled } from '../lib/styledcomponents/generator/StyledTypography';
import ExplanationCard from './ExplanationCard';

interface ExplanationCardsProps {
  explanationsToSave: IExplanationToSave[];
  handleUpdateExplanations: (explanation: IExplanationToSave, index: number) => void;
  isQuestionGenerating: boolean;
  isExplanationRegenerating: boolean;
  regenIndex: null | number;
}

export const ExplanationCards = ({
  explanationsToSave,
  handleUpdateExplanations,
  isQuestionGenerating,
  isExplanationRegenerating,
  regenIndex
}: ExplanationCardsProps) => {
  const isQuestionFilled = explanationsToSave.length > 0;
  return (
    <Box style={{height: '100%'}}>
      {!isQuestionFilled
      ?
        <EmptyExplanationCardContainer>
          <PlaceholderHeaderStyled>💡 Explanations Loading...</PlaceholderHeaderStyled>
          <PlaceholderBodyStyled> Fill out all fields to generate AI-powered explanations. </PlaceholderBodyStyled>
          { isQuestionGenerating && 
            <CircularProgress style={{color: "#FFF"}}/>
          }
        </EmptyExplanationCardContainer>
      : <AllExplanationCardsContainer>  
        {isQuestionFilled && explanationsToSave.map((explanation, index) => {
          return (
            <ExplanationCard
              index={index}
              explanation={explanation}
              handleUpdateExplanations={handleUpdateExplanations}
            />
          )
        })}
      </AllExplanationCardsContainer>
      }
    
    </Box>
  );
};