import { Box, CircularProgress } from '@mui/material';
import { IExplanationToSave, IRegenInput } from '../lib/Models';
import { EmptyExplanationCardContainer, AllExplanationCardsContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { PlaceholderHeaderStyled, PlaceholderBodyStyled } from '../lib/styledcomponents/generator/StyledTypography';
import ExplanationCard from './ExplanationCard';

interface ExplanationCardsProps {
  explanationsToSave: IExplanationToSave[];
  isSubmitted: boolean;
  selectedCards: boolean[];
  handleSaveExplanations: (explanation: IExplanationToSave) => void;
  handleExplanationClick: (input: IRegenInput) => void;
  saveDiscardExplanation: (
    question: string, selectedExplanation: string
  ) => void;
  isQuestionSaved: boolean;
  isQuestionGenerating: boolean;
  isExplanationRegenerating: boolean;
  regenIndex: null | number;
}

export const ExplanationCards = ({
  explanationsToSave,
  isSubmitted, 
  selectedCards,
  handleSaveExplanations,
  handleExplanationClick,
  saveDiscardExplanation,
  isQuestionSaved,
  isQuestionGenerating,
  isExplanationRegenerating,
  regenIndex
}: ExplanationCardsProps) => {
  const isQuestionFilled = explanationsToSave.length > 0;
  return (
    <>
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
              isSubmitted={isSubmitted}
              explanation={explanation}
              selectedCards={selectedCards}
              handleSaveExplanations={handleSaveExplanations}
              handleExplanationClick={handleExplanationClick}
              saveDiscardExplanation={saveDiscardExplanation}
              isQuestionSaved={isQuestionSaved}
              isRegenerating={isExplanationRegenerating && regenIndex === index}
            />
          )
        })}
      </AllExplanationCardsContainer>
      }
    
    </>
  );
};