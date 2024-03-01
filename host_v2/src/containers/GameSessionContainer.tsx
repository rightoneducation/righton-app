import React, { useState } from 'react';
import { IGameSession, GameSessionState, ApiClient, GameSessionParser } from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import StartGame from '../pages/StartGame';
import GameInProgress from '../pages/GameInProgress';
import { LocalModel } from '../lib/HostModels';

interface GameInProgressContainerProps {
  apiClient: ApiClient;
}
// may have to reformat/restructure this later but here is a sample answer object
interface AnswerOption {
  instructions: string[] | null;
  reason: string | null;
  content: string;
}

interface QuestionData {
  text: string;
  imageUrl: string | undefined;
}

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer
  name: string; // this player's name
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly
  incorrect: number; // number of players who selected tgis option and answered incorrectly
  players: Player[]; // an array of the players that selected this option
}

export default function GameSessionContainer({
  apiClient,
}: GameInProgressContainerProps) {
  console.log(apiClient); // eslint-disable-line
  const gameSession = GameSessionParser.gameSessionFromAWSGameSession({
    ...MockGameSession,
    currentState: MockGameSession.currentState as GameSessionState,
  });
  // TODO: delete hard coded values later
  const sampleQuestion: QuestionData = {
    text: 'A pair of shoes were 10% off last week. This week, theres an additional sale, and you can get an extra 40% off the already discounted price from last week. What is the total percentage discount that youd get if you buy the shoes this week?',
    imageUrl:
      'https://images.unsplash.com/photo-1609188944094-394637c26769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
  }; // eslint-disable-line

  const sampleAnswerOptionOne: AnswerOption = {
    instructions: [
      'step 1 step 1 step 1 step 1 step 1 step 1  step 1 step 1 step 1 step 1 step 1 step 1 ',
      'step 2',
      'step 3',
      'step 4',
    ],
    reason: null,
    content: 'an answer choice',
  }; // eslint-disable-line

  const sampleAnswerOptionTwo: AnswerOption = {
    instructions: null,
    reason: 'reasoning',
    content: 'another answer choice',
  }; // eslint-disable-line

  const samplePlayerOne: Player = {
    answer: 'C',
    isCorrect: false,
    name: 'Alex Williams',
  };
  const samplePlayerTwo: Player = {
    answer: 'C',
    isCorrect: false,
    name: 'Alessandro DeLuca-Smith',
  };
  const samplePlayerThree: Player = {
    answer: 'D',
    isCorrect: true,
    name: 'Jackson Cameron',
  };
  const samplePlayerFour: Player = {
    answer: 'A',
    isCorrect: false,
    name: 'Jeremiah Tanaka',
  };
  const sampleConfidenceData: ConfidenceOption[] = [
    { confidence: 'NOT_RATED', correct: 0, incorrect: 0, players: [] },
    { confidence: 'NOT_AT_ALL', correct: 0, incorrect: 0, players: [] },
    {
      confidence: 'KINDA',
      correct: 0,
      incorrect: 2,
      players: [samplePlayerOne, samplePlayerTwo],
    },
    { confidence: 'QUITE', correct: 0, incorrect: 0, players: [] },
    {
      confidence: 'VERY',
      correct: 1,
      incorrect: 1,
      players: [samplePlayerThree, samplePlayerFour],
    },
    { confidence: 'TOTALLY', correct: 0, incorrect: 0, players: [] },
  ];

  const [selectedMistakes, setSelectedMistakes] = useState<any[]>([]);
  const onSelectMistake = (value: any, isBasedOnPopularity: boolean): void => {
    console.log("test");
    console.log(value);
    setSelectedMistakes((prev: any[]) => {
      if (prev.includes(value)) {
        if (isBasedOnPopularity === false)
          return prev.filter((mistake: any) => mistake !== value);
        return prev;
      } 
      return [...prev, value];
    });
  }
  
 


  const handleStartGame = ()=>{
    console.log("test")
  }

  const totalQuestions = 5;
  const currentQuestionIndex = 3;
  const statePosition = 3;
  const isCorrect = false;
  const isIncorrect = false;

  const localModelMock: LocalModel = { currentTimer: 200, hasRejoined: false };
  const phaseOneTime = 180;
  const phaseTwoTime = 180;
  const hasRejoined = false;
  const currentTimer = 90;

  const totalTime =
    gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
      ? phaseOneTime
      : phaseTwoTime;



  const shortAnswerResponse = [
    {
      rawAnswer: 'y=mx+b',
      normAnswer: 'y=mx+b',
      isCorrect: true, // only every one
      isSelectMistaked: true, 
      count: 2,
      teams: ['Name1', 'Name2']
    },
    {
      rawAnswer: 'y=mx+4',
      normAnswer: 'y=mx+4',
      isCorrect: false,
      isSelectMistaked: true, 
      count: 1,
      teams: ['Name3']
    },
    {
      rawAnswer: 'y=mx+4',
      normAnswer: 'y=mx+4',
      isCorrect: false,
      isSelectMistaked: true, 
      count: 5,
      teams: ['Name4', 'Name5', 'Name6', 'Name7']
    }
  ];  

  switch (gameSession.currentState){
    case GameSessionState.TEAMS_JOINING:
      return (
        <StartGame 
          teams={gameSession.teams ?? []}
          currentQuestionIndex={currentQuestionIndex}
          questions={gameSession.questions}
          title={gameSession.title ?? ''}
          gameSessionId={gameSession.id}
          gameCode={gameSession.gameCode}
          currentState={gameSession.currentState}
          handleStartGame={handleStartGame}
        />
      );
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    default: 
      return (
        <GameInProgress 
          totalQuestions={gameSession.questions.length ?? 0}
          currentQuestionIndex={currentQuestionIndex}
          isCorrect={isCorrect}
          isIncorrect={isIncorrect}
          totalTime={totalTime}
          hasRejoined={hasRejoined}
          currentTimer={currentTimer}
          sampleConfidenceData={sampleConfidenceData}
          localModelMock={localModelMock}
          onSelectMistake={onSelectMistake}
          shortAnswerResponses={shortAnswerResponse}
        />
      );
  }
}

