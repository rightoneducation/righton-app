import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GameSessionState, GameSessionParser, 
  APIClients, Environment,
  IGameSession,
 } from '@righton/networking';
import MockGameSession from '../mock/MockGameSession.json';
import StartGame from '../pages/StartGame';
import GameInProgress from '../pages/GameInProgress';
import { ShortAnswerResponse, LocalModel } from '../lib/HostModels';
import sortMistakes from '../lib/HelperFunctions';

interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer
  name: string; 
}

interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; 
  incorrect: number; // number of players who selected tgis option and answered incorrectly
  players: Player[]; // an array of the players that selected this option
}

interface GameSessionContainerProps {
  apiClients: APIClients;
}

export default function GameSessionContainer({apiClients}: GameSessionContainerProps) {
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const gameSessionId = '0bcbd26e-17fb-414d-a63e-22ed5033a042';

  useEffect(() => {
    // Fetch game session data from AWS DynamoDB using the provided gameId
    const fetchGameSession = async () => {
      try {
        const response = await apiClients.gameSession.getGameSession(gameSessionId);
        setGameSession(response); // Set the game session data in state
      } catch (error) {
        console.error('error fetching game session:', error);
      }
    };
    
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
      gameSessionId,
      (response) => {
        console.log(response);
        setGameSession({...gameSession, ...response});
      },
    );
    
    // set up subscription for new teams joining
    let createTeamSubscription: any | null = null;
    createTeamSubscription = apiClients.team.subscribeCreateTeam(
      gameSessionId,
      (teamResponse) => {
        if (teamResponse.gameSessionTeamsId === gameSessionId) {
          setGameSession((prevState) => {
            const newState = JSON.parse(JSON.stringify(prevState));
            newState.teams.push(teamResponse);
            return newState;
          });
        }
      },
    );

    fetchGameSession();
    return () => {
      gameSessionSubscription?.unsubscribe();
      createTeamSubscription?.unsubscribe();
    };

  }, [apiClients]); // eslint-disable-line




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
  
  const totalTime = gameSession && gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
    ? phaseOneTime
    : phaseTwoTime;

  const [shortAnswerResponses, setShortAnswerResponses] = useState<ShortAnswerResponse[]>([ // eslint-disable-line
    {
      rawAnswer: 'y=x^2',
      normAnswer: 'y=x^2',
      isCorrect: true, // only every one
      isSelectedMistake: true,
      count: 2,
      teams: ['Name1', 'Name2'],
    },
    {
      rawAnswer: 'No Idea',
      normAnswer: 'No Idea',
      isCorrect: false,
      isSelectedMistake: true,
      count: 2,
      teams: ['Name3', 'Name13'],
    },
    {
      rawAnswer: '2x^4 + 6x^2 - 3x',
      normAnswer: '2x^4 + 6x^2 - 3x',
      isCorrect: false,
      isSelectedMistake: true,
      count: 4,
      teams: ['Name4', 'Name5', 'Name6', 'Name7'],
    },
    {
      rawAnswer: '4x^4 - x^3 + 7x^2 - 6x',
      normAnswer: '4x^4 - x^3 + 7x^2 - 6x',
      isCorrect: false,
      isSelectedMistake: true,
      count: 5,
      teams: ['Name8', 'Name9', 'Name10', 'Name11', 'Name12'],
    },
    {
      rawAnswer: 'x^2 - 4x - 12',
      normAnswer: 'x^2 - 4x - 12',
      isCorrect: false,
      isSelectedMistake: true,
      count: 1,
      teams: ['Name14'],
    },
  ]);
  const [isPopularMode, setIsPopularMode] = useState<boolean>(true);
  const [sortedMistakes, setSortedMistakes] = useState(React.useMemo(() => 
     sortMistakes(shortAnswerResponses, shortAnswerResponses.length, isPopularMode, 3),
     [shortAnswerResponses, isPopularMode]
  ));

  const handleDeleteTeam = (id: string) => {
    console.log("made it in");
    console.log(id);
    try {
      apiClients.team.deleteTeam(id).then((response) => {
        console.log(response);
        setGameSession((prevState) => {
          if (!prevState) return prevState;
          const updatedTeams = prevState.teams.filter((team) => team.id !== id);
          return { ...prevState, teams: updatedTeams };
        });
      });
    } catch (error) {
      console.log("DELETE TEAM DIDNT WORK HERE");
      console.log(error);
    }
  }


  switch (gameSession?.currentState){
 
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      return (
        <GameInProgress
          totalQuestions={gameSession?.questions.length ?? 0}
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
        />
      );
      case GameSessionState.TEAMS_JOINING:
        default:
        return (
          <StartGame
            teams={gameSession?.teams ?? []}
            questions={gameSession?.questions ?? []}
            title={gameSession?.title ?? ''}
            gameCode={gameSession?.gameCode ?? 0}
            handleDeleteTeam={handleDeleteTeam}
          />
        );
  }
}
