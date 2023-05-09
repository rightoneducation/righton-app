import React, { useState } from 'react';
import {
  GameSessionState,
  IGameSession,
  ITeam,
  ITeamAnswer,
  IQuestion,
  IChoice,
  ModelHelper,
  isNullOrUndefined,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import HeaderContent from '../components/HeaderContent';
import ResultsCard from '../components/ResultsCard';
import FooterContent from '../components/FooterContent';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import { BodyContentAreaPhaseResultsStyled } from '../lib/styledcomponents/layout/BodyContentAreaStyled';
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
}: PhaseResultsProps) {
  const currentQuestion = gameSession.questions[currentQuestionIndex ?? 0];
  const phaseNo = currentState === GameSessionState.PHASE_1_RESULTS ? 1 : 2;
  const currentTeam = teams?.find((team) => team.id === teamId);
  const originalScore = currentTeam?.score ?? 0;
  const [scoreFooter, setScoreFooter] = useState(originalScore); // eslint-disable-line @typescript-eslint/no-unused-vars
  const selectedAnswer = ModelHelper.getSelectedAnswer(currentTeam!, currentQuestion, phaseNo);

  // calculate new score for use in footer (todo: update gamesession object through api call)
  const calculateNewScore = (
    session: IGameSession,
    question: IQuestion,
    team: ITeam
  ) => {
    const newScore = ModelHelper.calculateBasicModeScoreForQuestion(
      session,
      question,
      team
    );
    return newScore;
  };

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
            phaseNo={phaseNo}
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
          newPoints={calculateNewScore(
            gameSession,
            gameSession.questions[currentQuestionIndex ?? 0],
            currentTeam!  // eslint-disable-line @typescript-eslint/no-non-null-assertion
          )}
          score={scoreFooter}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
