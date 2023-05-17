import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  GameSessionState,
  ITeam,
  IQuestion,
  ModelHelper,
} from '@righton/networking';
import HeaderContent from '../components/HeaderContent';
import FooterContent from '../components/FooterContent';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import ChooseAnswer from '../components/gameinprogress/ChooseAnswer';
import DiscussAnswer from '../components/gameinprogress/DiscussAnswer';
import FooterStackContainerStyled from '../lib/styledcomponents/layout/FooterStackContainerStyled';

interface GameInProgressProps {
  teams?: ITeam[];
  currentState: GameSessionState;
  teamAvatar: number;
  questions: IQuestion[];
  currentQuestionIndex?: number | null;
  teamId: string;
  answerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
    reason: string;
  }[];
  addTeamAnswerToTeamMember: (question: IQuestion, answerText: string, currentState: GameSessionState) => void;
}

export default function GameInProgress({
  teams,
  currentState,
  teamAvatar,
  questions,
  currentQuestionIndex,
  teamId,
  answerChoices,
  addTeamAnswerToTeamMember,
}: GameInProgressProps) {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const currentTeam = teams?.find((team) => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId( // eslint-disable-line @typescript-eslint/no-unused-vars
      currentTeam,
      currentQuestion.id
    );
  }

  // this breaks down the question text from the gameSession to isolate the sentence with the question mark for formatting purposes in the component
  const divideQuestionString = (inputText: string) => {
    const qmarkLocation = inputText.lastIndexOf('?');
    let introText = '';
    let questionText = '';

    if (qmarkLocation !== -1) {
      const periodLocation = inputText.lastIndexOf('.');
      if (periodLocation !== -1 && periodLocation < qmarkLocation) {
        introText = inputText.substring(0, periodLocation + 1);
        questionText = inputText.substring(
          periodLocation + 1,
          qmarkLocation + 1
        );
      }
    }
    return [introText, questionText];
  };

  const questionText = divideQuestionString(currentQuestion?.text);

  const questionUrl = currentQuestion?.imageUrl;
  const instructions = currentQuestion?.instructions;
  const [timerIsPaused, setTimerIsPaused] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleTimerIsFinished = () => {
    setTimerIsPaused(true);
  };

  const handleSubmitAnswer = (answerText: string) => {
    addTeamAnswerToTeamMember(currentQuestion, answerText, currentState);
    setIsSubmitted(true);
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
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
          handleTimerIsFinished={handleTimerIsFinished}
        />
      </HeaderStackContainerStyled>
      <BodyStackContainerStyled>
        <BodyBoxUpperStyled />
        <BodyBoxLowerStyled />
        {currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
          currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER ? (
              <ChooseAnswer
                isSmallDevice={isSmallDevice}
                questionText={questionText}
                questionUrl={questionUrl ?? ''}
                answerChoices={answerChoices}
                isSubmitted={isSubmitted}
                handleSubmitAnswer={handleSubmitAnswer}
                currentState={currentState}
                selectedAnswer={selectedAnswer}
                handleSelectAnswer={handleSelectAnswer}
              />
          ) : (
              <DiscussAnswer
                isSmallDevice={isSmallDevice}
                questionText={questionText}
                questionUrl={questionUrl ?? ''}
                answerChoices={answerChoices}
                instructions={instructions ?? ['']}
                currentState={currentState}
                currentTeam={currentTeam!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
                currentQuestion={currentQuestion}
              />
          )}
        
      </BodyStackContainerStyled>
      <FooterStackContainerStyled>
        {isSmallDevice ? (
          <PaginationContainerStyled className="swiper-pagination-container" />
        ) : null}
        <FooterContent
          avatar={teamAvatar}
          teamName={currentTeam ? currentTeam.name : 'Team One'}
          newPoints={10}
          score={120}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
