import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  IAPIClients,
  GameSessionState,
  ITeam,
  IQuestion,
  ModelHelper,
  ConfidenceLevel,
  isNullOrUndefined,
  BackendAnswer,
  IChoice,
  IAnswerHint,
  AnswerFactory,
  AnswerType,
  IAnswerSettings,
  Answer,
  NumericAnswer,
  MultiChoiceAnswer,
  IGameSession,
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
import {
  checkForSubmittedAnswerOnRejoin,
  checkForSelectedConfidenceOnRejoin,
  checkForSubmittedHintOnRejoin
} from '../lib/HelperFunctions';
import ErrorModal from '../components/ErrorModal';
import { ErrorType, LocalModel, StorageKeyAnswer, StorageKeyHint } from '../lib/PlayModels';

interface GameInProgressProps {
  apiClients: IAPIClients;
  teams: ITeam[];
  currentState: GameSessionState;
  teamMemberAnswersId: string;
  teamId: string;
  teamName: string;
  teamAvatar: number;
  phaseOneTime: number;
  phaseTwoTime: number;
  questions: IQuestion[];
  currentQuestionIndex: number;
  score: number;
  answerChoices: IChoice[];
  hasRejoined: boolean;
  currentTimer: number;
  localModel: LocalModel;
  isShortAnswerEnabled: boolean;
  gameSession: IGameSession;
  newPoints?: number;
  isAddTime: boolean;
}

export default function GameInProgress({
  apiClients,
  teams,
  currentState,
  teamMemberAnswersId,
  teamId,
  teamName,
  teamAvatar,
  questions,
  phaseOneTime,
  phaseTwoTime,
  currentQuestionIndex,
  score,
  answerChoices,
  hasRejoined,
  currentTimer,
  isAddTime,
  localModel,
  isShortAnswerEnabled,
  gameSession,
  newPoints,
}: GameInProgressProps) {
  const theme = useTheme();
  const [isAnswerError, setIsAnswerError] = useState(false);
  const [isConfidenceError, setIsConfidenceError] = useState(false);
  const [answerHint, setAnswerHint] = useState<IAnswerHint>(() => {
    const rejoinSubmittedHint = checkForSubmittedHintOnRejoin(
      localModel,
      hasRejoined,
      currentState,
      currentQuestionIndex ?? 0
    ); 
    return rejoinSubmittedHint;
  });
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const currentTeam = teams?.find((team) => team.id === teamId);
  const currentQuestion = questions[currentQuestionIndex ?? 0];
  const answerSettings: IAnswerSettings | null = currentQuestion.answerSettings ?? null;
  let teamAnswers: (BackendAnswer | null)[] | null | undefined;
  if (currentTeam != null) {
    teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(
      currentTeam,
      currentQuestion.id
    ) ?? [];
  }
  const [multiChoiceCharacter, setMultiChoiceCharacter] = useState('');
  const questionText = currentQuestion.text;
  const totalTime =
    currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
      ? phaseOneTime
      : phaseTwoTime;
  const questionUrl = currentQuestion?.imageUrl;
  const instructions = currentQuestion?.instructions;

  const [timerIsPaused, setTimerIsPaused] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  // state for whether a player is selecting an answer and if they submitted that answer
  // initialized through a check on hasRejoined to prevent double answers on rejoin
  const [backendAnswer, setBackendAnswer] = useState<BackendAnswer>(() => {
    const rejoinSubmittedAnswer = checkForSubmittedAnswerOnRejoin(
      localModel,
      hasRejoined,
      currentState,
      currentQuestionIndex ?? 0,
      isShortAnswerEnabled
    );
    return rejoinSubmittedAnswer;
  });
  const [displaySubmitted, setDisplaySubmitted] = useState<boolean>(
    !isNullOrUndefined(backendAnswer?.isSubmitted)
  );
  const currentAnswer = teamAnswers?.find(
    (answer) => answer?.questionId === currentQuestion.id
  );
  const [teamAnswerId, setTeamAnswerId] = useState<string>(
    currentAnswer?.id ?? ''
  ); // This will be moved later (work in progress - Drew)
  const handleTimerIsFinished = () => {
    setBackendAnswer((prev) => ({ ...prev, isSubmitted: true }));
    setTimerIsPaused(true);
  };

  // Initialized through a check on hasRejoined to repopulate conifdence related fields accordingly
  const [selectConfidence, setSelectConfidence] = useState<{
    selectedConfidenceOption: string;
    isSelected: boolean;
    timeOfLastSelect: number;
  }>(() => {
    let rejoinSelectedConfidence = null;
    rejoinSelectedConfidence = checkForSelectedConfidenceOnRejoin(
      hasRejoined,
      currentAnswer,
      currentState
    );
    return rejoinSelectedConfidence;
  });

  function isAnswerNumeric (answer: Answer): answer is NumericAnswer {
    return answer instanceof NumericAnswer;
  }

  function isAnswerMultiChoice (answer: Answer): answer is MultiChoiceAnswer {
    return answer instanceof MultiChoiceAnswer;
  }

  // creates new team answer when student submits
  const handleSubmitAnswer = async (answer: BackendAnswer) => {
    try {
      const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion)?.text ?? null;
      if (correctAnswer){
        const normCorrectAnswer = answer.answer.normalizeCorrectAnswer(correctAnswer);
        if (isAnswerNumeric(answer.answer))
          answer.isCorrect = answer.answer.isEqualTo([Number(normCorrectAnswer)]) as boolean; // eslint-disable-line 
        else {
          answer.isCorrect = answer.answer.isEqualTo(normCorrectAnswer) as boolean; // eslint-disable-line 
        }
        if (isAnswerMultiChoice(answer.answer)){
          answer.answer.multiChoiceCharacter = multiChoiceCharacter; // eslint-disable-line
        }
      }
      console.log(correctAnswer);
      const response = await apiClients.teamAnswer.addTeamAnswer(answer);
      window.localStorage.setItem(StorageKeyAnswer, JSON.stringify(answer));
      setTeamAnswerId(response.id ?? '');
      setBackendAnswer(answer);
      setDisplaySubmitted(true);
    } catch (e) {
      setIsAnswerError(true);
    }
  };

  const handleSubmitHint = async (normalizedHint: IAnswerHint) => {
    try{
      await apiClients.teamAnswer.updateTeamAnswerHint(teamAnswerId, normalizedHint);
      window.localStorage.setItem(StorageKeyHint, JSON.stringify(normalizedHint));
      setAnswerHint(normalizedHint);
    } catch (e) {
      setIsAnswerError(true);
    }
  };

  const handleRetry = () => {
    if (isAnswerError) {
      setIsAnswerError(false);
      setBackendAnswer((prev) => ({ ...prev, isSubmitted: false }));
    }
    if (isConfidenceError) {
      setIsConfidenceError(false);
      setSelectConfidence({
        timeOfLastSelect: 0,
        selectedConfidenceOption: ConfidenceLevel.NOT_RATED,
        isSelected: false,
      });
    }
  };

  const handleSelectAnswer = (answerText: string, currentMultiChoiceCharacter: string) => {
    setMultiChoiceCharacter(currentMultiChoiceCharacter);
    const answer = new BackendAnswer(
      AnswerFactory.createAnswer(answerText, AnswerType.MULTICHOICE, undefined, currentMultiChoiceCharacter),
      false,
      false,
      currentState,
      currentQuestionIndex ?? 0,
      currentQuestion.id,
      teamMemberAnswersId,
      teamId,
      teamName,
      answerText,
      false
    )
    window.localStorage.setItem(
      StorageKeyAnswer,
      JSON.stringify(answer)
    );
    setBackendAnswer((prev) => ({ ...prev, ...answer }));
  };

  const setTimeOfLastConfidenceSelect = (time: number) => {
    setSelectConfidence((prev) => ({ ...prev, timeOfLastSelect: time }));
  };

  const handleSelectConfidence = async (confidence: ConfidenceLevel) => {
    try {
      // since subscription.isLoading does not update when user selects answer,
      // set isSelected to false when user selects or reselects confidence so
      // that the loading message can display while we wait for apiClient. Then
      // after await, set isSelected to true again
      setSelectConfidence((prev) => ({ ...prev, isSelected: false }));
      await apiClients.teamAnswer.updateTeamAnswerConfidence(teamAnswerId, confidence);
      setSelectConfidence((prev) => ({
        ...prev,
        selectedConfidenceOption: confidence,
        isSelected: true,
      }));
    } catch (e) {
      setIsConfidenceError(true);
    }
  };

  return (
    <StackContainerStyled
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <ErrorModal
        isModalOpen={isAnswerError}
        errorType={ErrorType.ANSWER}
        errorText=""
        handleRetry={handleRetry}
      />
      <ErrorModal
        isModalOpen={isConfidenceError}
        errorType={ErrorType.CONFIDENCE}
        errorText=""
        handleRetry={handleRetry}
      />
    <HeaderStackContainerStyled>
        <HeaderContent
          currentState={currentState}
          isCorrect={false}
          isIncorrect={false}
          totalTime={totalTime}
          isAddTime={isAddTime}
          currentTimer={currentTimer}
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
            answerSettings = {answerSettings}
            answerChoices={answerChoices}
            isSubmitted={backendAnswer.isSubmitted ?? false}
            displaySubmitted={displaySubmitted}
            handleSubmitAnswer={handleSubmitAnswer}
            currentState={currentState}
            handleSelectAnswer={handleSelectAnswer}
            isConfidenceEnabled={currentQuestion.isConfidenceEnabled}
            handleSelectConfidence={handleSelectConfidence}
            isConfidenceSelected={selectConfidence.isSelected}
            selectedConfidenceOption={selectConfidence.selectedConfidenceOption}
            timeOfLastConfidenceSelect={selectConfidence.timeOfLastSelect}
            setTimeOfLastConfidenceSelect={setTimeOfLastConfidenceSelect}
            isShortAnswerEnabled={isShortAnswerEnabled}
            backendAnswer={backendAnswer}
            currentQuestionIndex={currentQuestionIndex ?? 0}
            answerHint={answerHint ?? null}
            isHintEnabled={currentQuestion.isHintEnabled}
            handleSubmitHint={handleSubmitHint}
            isHintSubmitted={answerHint?.isHintSubmitted ?? false}
            currentTeam={currentTeam ?? null}
            questionId={currentQuestion.id ?? ''}
            teamMemberAnswersId={teamMemberAnswersId}
          />
        ) : (
          <DiscussAnswer
            isSmallDevice={isSmallDevice}
            questionText={questionText}
            questionUrl={questionUrl}
            answerChoices={answerChoices}
            instructions={instructions}
            currentState={currentState}
            currentTeam={currentTeam!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
            currentQuestion={currentQuestion}
            isShortAnswerEnabled={isShortAnswerEnabled}
            gameSession={gameSession}
            newPoints={newPoints}
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
          newPoints={newPoints}
        />
      </FooterStackContainerStyled>
    </StackContainerStyled>
  );
}
