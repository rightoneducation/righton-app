import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ApiClient,
  GameSessionState,
  ITeam,
  ITeamAnswer,
  IQuestion,
  ModelHelper,
  ConfidenceLevel
} from '@righton/networking';
import HeaderContent from '../components/HeaderContent';
import FooterContent from '../components/FooterContent';
import PaginationContainerStyled from '../lib/styledcomponents/PaginationContainerStyled';
import StackContainerStyled from '../lib/styledcomponents/layout/StackContainerStyled';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import BodyStackContainerStyled from '../lib/styledcomponents/layout/BodyStackContainerStyled';
import BodyBoxUpperStyled from '../lib/styledcomponents/layout/BodyBoxUpperStyled';
import BodyBoxLowerStyled from '../lib/styledcomponents/layout/BodyBoxLowerStyled';
import ChooseAnswer from './gameinprogress/ChooseAnswer';
import DiscussAnswer from './gameinprogress/DiscussAnswer';
import FooterStackContainerStyled from '../lib/styledcomponents/layout/FooterStackContainerStyled';
import { checkForSubmittedAnswerOnRejoin } from '../lib/HelperFunctions';
import ErrorModal from '../components/ErrorModal';
import { ErrorType, LocalModel } from '../lib/PlayModels';

interface GameInProgressProps {
  apiClient: ApiClient;
  teams?: ITeam[];
  currentState: GameSessionState;
  teamMemberId: string;
  teamAvatar: number;
  phaseOneTime: number;
  phaseTwoTime: number;
  questions: IQuestion[];
  currentQuestionIndex?: number | null;
  teamId: string;
  score: number;
  answerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
    reason: string;
  }[];
  hasRejoined: boolean;
  currentTimer: number;
  localModel: LocalModel;
}

export default function GameInProgress({
  apiClient,
  teams,
  currentState,
  teamMemberId,
  teamAvatar,
  questions,
  phaseOneTime,
  phaseTwoTime,
  currentQuestionIndex,
  teamId,
  score,
  answerChoices,
  hasRejoined,
  currentTimer,
  localModel,
}: GameInProgressProps) {
  const theme = useTheme();
  const [isError, setIsError] = useState(false);
  const [displaySubmitted, setDisplaySubmitted] = useState(false);
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const currentTeam = teams?.find((team) => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  let teamAnswers: (ITeamAnswer | null)[] | null | undefined;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(
      // eslint-disable-line @typescript-eslint/no-unused-vars
      currentTeam,
      currentQuestion.id
    );
  }

  // this breaks down the question text from the gameSession for bold formatting of the question text
  // first, it looks for the last question mark and cuts the question from the proceeding period to the end of the string
  // second, if there isn't a question mark, it looks for the last period and cuts the question from the proceeding period to the end of the string
  // if neither of those, it just uses the default entire string as the question text
  const divideQuestionString = (inputText: string) => {
    const qmarkLocation = inputText.lastIndexOf('?');
    const lastPeriodLocation = inputText.lastIndexOf('.');
    let introText = '';
    let questionText = inputText;
    if (qmarkLocation !== -1) {
      const splicedString = inputText.substring(0, qmarkLocation + 1);
      const periodLocation = splicedString.lastIndexOf('.');
      questionText = splicedString;
      if (periodLocation !== -1) {
        introText = inputText.substring(0, periodLocation + 1);
        questionText = inputText.substring(
          periodLocation + 1,
          inputText.length
        );
      }
    } else {
      const splicedString = inputText.substring(0, lastPeriodLocation);
      const secondLastPeriodLocation = splicedString.lastIndexOf('.');
      if (secondLastPeriodLocation !== -1) {
        introText = inputText.substring(0, secondLastPeriodLocation + 1);
        questionText = inputText.substring(
          secondLastPeriodLocation + 1,
          inputText.length
        );
      }
    }
    return [introText, questionText];
  };

  const questionText = divideQuestionString(currentQuestion?.text);
  const totalTime =
    currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
      ? phaseOneTime
      : phaseTwoTime;
  const questionUrl = currentQuestion?.imageUrl;
  const instructions = currentQuestion?.instructions;
  const [timerIsPaused, setTimerIsPaused] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  // state for whether a player is selecting an answer and if they submitted that answer
  // initialized through a check on hasRejoined to prevent double answers on rejoin
  const [selectSubmitAnswer, setSelectSubmitAnswer] = useState<{
    selectedAnswerIndex: number | null;
    isSubmitted: boolean;
  }>(() => {
    let rejoinSubmittedAnswer = null;
    rejoinSubmittedAnswer = checkForSubmittedAnswerOnRejoin(
      hasRejoined,
      teamAnswers,
      answerChoices,
      currentState
    );
    return rejoinSubmittedAnswer;
  });

  // TODO: handle case where player is rejoining
  const [isConfidenceSelected, setIsConfidenceSelected] =
    useState<boolean>(false);
  const [selectedConfidenceOption, setSelectedConfidenceOption] = useState<
    number | null
  >(null);
  const [timeOfLastConfidenceSelect, setTimeOfLastConfidenceSelect] = useState<number | null>(null);
  const [teamAnswerId, setTeamAnswerId] = useState<string>(''); // this will be changed later -Drew

  const handleTimerIsFinished = () => {
    setSelectSubmitAnswer((prev) => ({ ...prev, isSubmitted: true }));
    setTimerIsPaused(true);
  };

  const handleSubmitAnswer = async (answerText: string) => {
    try {
      const response = await apiClient.addTeamAnswer(
        teamMemberId,
        currentQuestion.id,
        answerText,
        currentState === GameSessionState.CHOOSE_CORRECT_ANSWER,
        currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER
      );
      setTeamAnswerId(response.id);
      setSelectSubmitAnswer((prev) => ({ ...prev, isSubmitted: true }));
      setDisplaySubmitted(true);
    } catch {
      setIsError(true);
    }
  };

  const handleRetry = () => {
    setIsError(false);
    setSelectSubmitAnswer((prev) => ({ ...prev, isSubmitted: false }));
  };

  const handleSelectAnswer = (index: number) => {
    setSelectSubmitAnswer((prev) => ({ ...prev, selectedAnswerIndex: index }));
  };

  const handleSelectConfidence = async (index: number, confidence: ConfidenceLevel) => {
    try {
      await apiClient.updateTeamAnswer(teamAnswerId, true, confidence);
      setSelectedConfidenceOption(index);
      setIsConfidenceSelected(true);
    }
    catch {
      setIsError(true);
    }
  };

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <ErrorModal
        isModalOpen={isError}
        errorType={ErrorType.ANSWER}
        errorText=""
        handleRetry={handleRetry}
      />
      <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={totalTime}
          currentTimer={hasRejoined ? currentTimer : totalTime}
          isPaused={false}
          isFinished={false}
          handleTimerIsFinished={handleTimerIsFinished}
          localModel={localModel}
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
            isSubmitted={selectSubmitAnswer.isSubmitted}
            displaySubmitted={displaySubmitted}
            handleSubmitAnswer={handleSubmitAnswer}
            currentState={currentState}
            selectedAnswer={selectSubmitAnswer.selectedAnswerIndex}
            handleSelectAnswer={handleSelectAnswer}
            handleSelectConfidence={handleSelectConfidence}
            isConfidenceSelected={isConfidenceSelected}
            selectedConfidenceOption={selectedConfidenceOption}
            timeOfLastConfidenceSelect={timeOfLastConfidenceSelect}
            setTimeOfLastConfidenceSelect={setTimeOfLastConfidenceSelect}
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
          score={score}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
