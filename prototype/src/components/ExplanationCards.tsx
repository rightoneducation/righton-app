import { Box, CircularProgress } from '@mui/material';
import { IQuestionToSave, IRegenInput } from '../lib/Models';
import { ExplanationCardContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { PlaceholderHeaderStyled, PlaceholderBodyStyled } from '../lib/styledcomponents/generator/StyledTypography';
import ExplanationCard from './ExplanationCard';

interface ExplanationCardsProps {
  questionToSave: IQuestionToSave
  isSubmitted: boolean;
  selectedCards: boolean[];
  setQuestionToSave: (questionToSave: IQuestionToSave) => void;
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
  questionToSave,
  isSubmitted, 
  selectedCards,
  setQuestionToSave,
  handleExplanationClick,
  saveDiscardExplanation,
  isQuestionSaved,
  isQuestionGenerating,
  isExplanationRegenerating,
  regenIndex
}: ExplanationCardsProps) => {
  const isQuestionFilled = questionToSave.wrongAnswers.length > 0;
  console.log(questionToSave);
  return (
    <ExplanationCardContainer isQuestionFilled={isQuestionFilled}> 
      {!isQuestionFilled
      ?
        <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <PlaceholderHeaderStyled>💡 Explanations Awaiting...</PlaceholderHeaderStyled>
          <PlaceholderBodyStyled> Fill out all fields to generate AI-powered explanations. </PlaceholderBodyStyled>
          { isQuestionGenerating && 
            <CircularProgress style={{color: "#FFF"}}/>
          }
        </Box>
      : isQuestionFilled && questionToSave.wrongAnswers.map((explanation, index) => {
        return (
          <ExplanationCard
            index={index}
            questionToSave={questionToSave}
            isSubmitted={isSubmitted}
            explanation={explanation}
            selectedCards={selectedCards}
            setQuestionToSave={setQuestionToSave}
            handleExplanationClick={handleExplanationClick}
            saveDiscardExplanation={saveDiscardExplanation}
            isQuestionSaved={isQuestionSaved}
            isRegenerating={isExplanationRegenerating && regenIndex === index}
          />
        )
      })}
    </ExplanationCardContainer>
  );
};