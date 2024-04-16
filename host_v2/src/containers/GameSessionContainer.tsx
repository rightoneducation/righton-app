import React, { useState } from 'react';
import { GameSessionState,GameSessionParser, ConfidenceLevel } from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import StartGame from '../pages/StartGame';
import GameInProgress from '../pages/GameInProgress';
import { ShortAnswerResponse, LocalModel } from '../lib/HostModels';
import {sortMistakes} from "../lib/HelperFunctions"

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

export default function GameSessionContainer() {
  const gameSession = GameSessionParser.gameSessionFromAWSGameSession({
    ...MockGameSession,
    currentState: MockGameSession.currentState as GameSessionState,
  });

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
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>(['4x^4 - x^3 + 7x^2 - 6x', '2x^4 + 6x^2 - 3x', 'No Idea']); // eslint-disable-line


  const onSelectMistake = (value: string, isBasedOnPopularity: boolean): void => {
    setSelectedMistakes((prev: string[]) => {
      if (prev.includes(value)) {
        if (isBasedOnPopularity === false)
          return prev.filter((mistake: string) => mistake !== value);
        return prev;
      }

      return [...prev, value];
    });
  }
  const currentQuestionIndex = 3;
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
  
  let myConfidenceLevel1: ConfidenceLevel;
  myConfidenceLevel1 = ConfidenceLevel.VERY;

  let anotherConfidenceLevel2 = ConfidenceLevel.KINDA;
  anotherConfidenceLevel2 = ConfidenceLevel.KINDA;

  const [shortAnswerResponses, setShortAnswerResponses] = useState<ShortAnswerResponse[]>([ // eslint-disable-line
    {
      rawAnswer: 'y=x^2',
      normAnswer: 'y=x^2',
      isCorrect: true, // only every one
      isSelectedMistake: true,
      count: 2,
      teams: [{name: 'Name1', id: "1", confidence:  myConfidenceLevel1}, 
      {name: 'Name2', id: "2", confidence:  anotherConfidenceLevel2}],
    },
    {
      rawAnswer: 'No Idea',
      normAnswer: 'No Idea',
      isCorrect: false,
      isSelectedMistake: true,
      count: 2,
      teams: [{name: 'Name3', id: "3", confidence:  myConfidenceLevel1}, 
      {name: 'Name4', id: "4", confidence:  anotherConfidenceLevel2}],
    },
    {
      rawAnswer: '2x^4 + 6x^2 - 3x',
      normAnswer: '2x^4 + 6x^2 - 3x',
      isCorrect: false,
      isSelectedMistake: true,
      count: 4,
      teams: [{name: 'Name5', id: "5", confidence:  anotherConfidenceLevel2}, 
      {name: 'Name6', id: "6", confidence:  anotherConfidenceLevel2}, 
      {name: 'Name7', id: "7", confidence:  anotherConfidenceLevel2},
      {name: 'Name8', id: "8", confidence:  anotherConfidenceLevel2}],
    },
    {
      rawAnswer: '4x^4 - x^3 + 7x^2 - 6x',
      normAnswer: '4x^4 - x^3 + 7x^2 - 6x',
      isCorrect: false,
      isSelectedMistake: true,
      count: 5,
      teams: [{name: 'Name9', id: "9", confidence:  anotherConfidenceLevel2},
      {name: 'Name10', id: "10", confidence:  myConfidenceLevel1},
      {name: 'Name11', id: "11", confidence:  myConfidenceLevel1},
      {name: 'Name12', id: "12", confidence:  myConfidenceLevel1},
      {name: 'Name13', id: "13", confidence:  anotherConfidenceLevel2}],
    },
    {
      rawAnswer: 'x^2 - 4x - 12',
      normAnswer: 'x^2 - 4x - 12',
      isCorrect: false,
      isSelectedMistake: true,
      count: 1,
      teams: [{name: 'Name14', id: "14", confidence:  myConfidenceLevel1}],
    },
  ]);
  const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
  const [sortedMistakes, setSortedMistakes] = useState(React.useMemo(() => 
     sortMistakes(shortAnswerResponses, shortAnswerResponses.length, isPopularMode, 3),
     [shortAnswerResponses, isPopularMode]
  ))

  // Mock Data for PlayerThinking component
  const [hints, setHints] = useState(['1', '2', '3', '4', '5', '6' , '7', '8', '9', '10', '11', '12', '13', '14']);
  const [gptHints, setGptHints] = useState([ { themeText: 'No Response', teams: ['1', '2', '3'], teamCount: 3}, 
  { themeText: 'circle, multiply', teams: ['4', '5', '6', '7'], teamCount: 4}, 
  { themeText: 'interior angles', teams: ['8', '9'], teamCount: 2},
  { themeText: 'No common words/phrases', teams: ['10', '11', '12', '13', '14'], teamCount: 5}]);
  
  const [isShortAnswerEnabled, setIsShortAnswerEnabled] = useState(false);
  const responsesRef = React.useRef(null);
  const confidenceCardRef = React.useRef(null);
  const hintCardRef = React.useRef(null);
  const [hintsError, setHintsError] = React.useState(false);
  const [isHintLoading, setisHintLoading] = React.useState(false);

  const handleProcessHints = async (hints) => {
    setHintsError(false);
    try {
      const parsedIncomingHints = hints.map((hint) => {
        return JSON.parse(hint);
      });
      const currentQuestion = gameSession?.questions[gameSession?.currentQuestionIndex];
      const questionText = currentQuestion.text;
      const correctChoiceIndex =
        currentQuestion.choices.findIndex(({ isAnswer }) => isAnswer);
      const correctAnswer = currentQuestion.choices[correctChoiceIndex].text;
        // adds rawHint text to parsedHints received from GPT
        // (we want to minimize the amount of data we send and receive to/from OpenAI
        // so we do this ourselves instead of asking GPT to return data we already have)
        const hintsLookup = new Map(parsedIncomingHints.map(hint => [hint.teamName, hint.rawHint]));
        const combinedHints = parsedHints.map(parsedHint => {
          const updatedTeams = parsedHint.teams.map(team => {
            if (hintsLookup.has(team)) {
              return { name: team, rawHint: hintsLookup.get(team) };
            } else {
              return team;
            }
          });

          return { ...parsedHint, teams: updatedTeams };
        });
        console.log(combinedHints);
        setGptHints(combinedHints);
        setisHintLoading(false);
      })
        .catch(e => {
          console.log(e);
          setHintsError(true);
        })
    } catch {
      setHintsError(true);
    }
  };


  switch (gameSession.currentState){
    case GameSessionState.TEAMS_JOINING:
      return (
        <StartGame
          teams={gameSession.teams ?? []}
          questions={gameSession.questions}
          title={gameSession.title ?? ''}
          gameCode={gameSession.gameCode}
        />
      );
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    default:
      return (
        <GameInProgress
          hints={hints}
          gptHints={gptHints}
          questions={gameSession.questions}
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
          sortedMistakes={sortedMistakes}
          setSortedMistakes={setSortedMistakes}
          isPopularMode={isPopularMode}
          setIsPopularMode={setIsPopularMode}
          isShortAnswerEnabled={isShortAnswerEnabled}
          responsesRef={responsesRef}
          confidenceCardRef={confidenceCardRef}
          hintCardRef={hintCardRef}
          hintsError={hintsError}
          isHintLoading={isHintLoading}
        />
      );
  }
}
