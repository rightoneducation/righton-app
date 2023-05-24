import React, { useEffect } from 'react';
import {
  GameSessionState,
  IGameSession,
  ITeam,
  ModelHelper,
} from '@righton/networking';
import HeaderContent from '../components/HeaderContent';
import ResultsCard from '../components/ResultsCard';
import FooterContent from '../components/FooterContent';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaPhaseResultsStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import FooterStackContainerStyled from '../lib/styledcomponents/layout/FooterStackContainerStyled';
import 'swiper/css';
import 'swiper/css/pagination';

interface PhaseResultsProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  currentQuestionIndex?: number | null;
  teamId: string;
  gameSession: IGameSession;
  answerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
  }[];
  score: number;
  handleUpdateScore: (newScore: number) => void;
  isRejoin: boolean;
  setIsRejoin: (isRejoin: boolean) => void;
}

/**
 * This component is used to display the results to the player (at the end of Phase 1 and Phase 2)
 *
 * It's comprised of the following:
 *
 * PhaseResults.tsx (page-level container, including header/body/footer content)
 * - Calculates final scores using helper functions and sends to footer for updated display
 *
 * ResultsCard.tsx (card container that floats over other layout elements and holds result selectors)
 *
 * - This takes all the answers and determines the type of result selector to display
 * - These are assigned during the mapping of the answers when rendering result selectors
 *
 * ResultSelector.tsx (individual result selector per answer option)
 *
 * - Styling is provided based on the AnswerType that is received from ResultsCard.tsx
 */
export default function PhaseResults({
  teams,
  currentState,
  teamAvatar,
  currentQuestionIndex,
  teamId,
  gameSession, // todo: adjust networking helper method for score calc to req only teams instead of gamesession
  answerChoices,
  score,
  handleUpdateScore,
  isRejoin,
  setIsRejoin
}: PhaseResultsProps) {
  const currentQuestion = gameSession.questions[currentQuestionIndex ?? 0];
  const currentTeam = teams?.find((team) => team.id === teamId);
  const selectedAnswer = ModelHelper.getSelectedAnswer(
    currentTeam!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    currentQuestion,
    currentState
  );
  
  const [newScore, setNewScore] = React.useState<number>(0);

  // calculate new score for use in footer
  // using useEffect here because scoreindicator causes parent rerenders as it listens to newScore while animating
  useEffect(() => {
    let calcNewScore = 0;
    if (!isRejoin){ 
        calcNewScore = ModelHelper.calculateBasicModeScoreForQuestion(
        gameSession,
        currentQuestion,
        currentTeam! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
    } else {
      setIsRejoin(false);
    
    }
    setNewScore(calcNewScore)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={() => {}}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        <BodyContentAreaPhaseResultsStyled container>
          <ResultsCard
            gameSession={gameSession}
            answers={answerChoices}
            selectedAnswer={selectedAnswer ?? null}
            currentState={currentState}
            currentQuestionId={currentQuestion.id}
          />
        </BodyContentAreaPhaseResultsStyled>
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={newScore}
          score={score}
          handleUpdateScore={handleUpdateScore}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}