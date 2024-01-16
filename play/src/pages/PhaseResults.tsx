import React, { useState, useEffect } from 'react';
import {
  ApiClient,
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
import ErrorModal from '../components/ErrorModal';
import { ErrorType } from '../lib/PlayModels';
import 'swiper/css';
import 'swiper/css/pagination';

interface PhaseResultsProps {
  apiClient: ApiClient;
  teams: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  currentQuestionIndex: number;
  teamId: string;
  gameSession: IGameSession;
  answerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
  }[];
  score: number;
  hasRejoined: boolean;
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
  apiClient,
  teams,
  currentState,
  teamAvatar,
  currentQuestionIndex,
  teamId,
  gameSession, // todo: adjust networking helper method for score calc to req only teams instead of gamesession
  answerChoices,
  score,
  hasRejoined,
}: PhaseResultsProps) {
  // isError consists of two values:
  // error: boolean - whether or not an error has occurred, used to display error modal
  // withheldPoints: number - the number of points that were going to be assigned to the player before the error, so the player can retry the request
  const [isError, setIsError] = useState<{
    error: boolean;
    withheldPoints: number;
  }>({ error: false, withheldPoints: 0 });
  const currentQuestion = gameSession.questions[currentQuestionIndex];
  const currentTeam = teams.find((team) => team.id === teamId);
  const selectedAnswer = ModelHelper.getSelectedAnswer(
    currentTeam!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    currentQuestion,
    currentState
  );

  const [newPoints, setNewPoints] = React.useState<number>(0);
  // update teamscore on the backend, if it fails, flag the error to pop the error modal
  const updateTeamScore = async (inputTeamId: string, newScore: number) => {
    try {
      await apiClient.updateTeam({ id: inputTeamId, score: newScore + score });
      setNewPoints(newScore);
    } catch {
      setIsError({ error: true, withheldPoints: newScore });
    }
  };

  // calculate new score for use in footer
  // using useEffect here because scoreindicator causes parent rerenders as it listens to newScore while animating
  useEffect(() => {
    let calcNewScore = 0;
    if (!hasRejoined) {
      calcNewScore = ModelHelper.calculateBasicModeScoreForQuestion(
        gameSession,
        currentQuestion,
        currentTeam! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
    }
    updateTeamScore(teamId, calcNewScore);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    setIsError((prev) => ({ ...prev, error: false }));
    updateTeamScore(teamId, isError.withheldPoints);
  };

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <ErrorModal
        isModalOpen={isError.error}
        errorType={ErrorType.SCORE}
        handleRetry={handleRetry}
      />
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={15}
          currentTimer={0}
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
          newPoints={newPoints}
          score={score}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
