import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isNullOrUndefined,
  IAPIClients,
  IGameSession,
  ITeam,
  ModelHelper,
  GameSessionState,
} from '@righton/networking';
import { StorageKey, StorageKeyAnswer} from '../lib/PlayModels';

/**
 * Custom hook to fetch and subscribe to game session. Follows:
 * https://react.dev/learn/you-might-not-need-an-effect#fetching-data with determination that useEffect is ok for now
 * @param gameSessionId
 * @param apiClient
 * @returns
 */
export default function useFetchAndSubscribeGameSession(
  gameSessionId: string,
  apiClients: IAPIClients,
  retry: number,
  isInitialRejoin: boolean,
  teamId: string
) {
  const [gameSession, setGameSession] = useState<IGameSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [hasRejoined, setHasRejoined] = useState<boolean>(isInitialRejoin);
  const [isError, setIsError] = useState<{ error: boolean; withheldPoints: number }>({ error: false, withheldPoints: 0 });
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isAddTime, setIsAddTime] = useState<boolean>(false);
  const [newPoints, setNewPoints] = useState<number>(0);


  // timer functions
  const calculateCurrentTime = (response: IGameSession | null) => {
    let allottedTime = 0;
    console.log(response);
    if (response){
      if (response?.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
        allottedTime = response?.phaseOneTime;
      } else if (response?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
        allottedTime = response?.phaseTwoTime;
      }

      const getStartTime = Number(response?.startTime);
      if (getStartTime) {
        const difference = Date.now() - getStartTime;
        if (difference >= allottedTime * 1000) {
          return 0;
        } 
        const remainingTime = allottedTime - Math.trunc(difference / 1000);
        return remainingTime;
      }
    }
    return 0;
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      setCurrentTime(() => calculateCurrentTime(gameSession ?? null));
    }
  };

  // useEffect to handle subscriptions
  useEffect(() => {
    let ignore = false;
    let gameSessionSubscription: any;
    let teamsSubscription: any;

    if (retry > 0) {
      setIsLoading(true);
      setError('');
    }

    if (!gameSessionId) {
      setError(`${t('error.connect.gamesessionerror')}`);
      setIsLoading(false);
      return;
    }

    // added so we can update th score for the discuss page. (previously implemented in results pages we got rid of)
    const updateTeamScore = async (inputTeamId: string, prevScore: number, newScore: number) => {
      try {
        await apiClients.team.updateTeam({ id: inputTeamId, score: newScore + prevScore });
        setNewPoints(newScore);
      } catch {
        setIsError({ error: true, withheldPoints: newScore });
      }
    };

    apiClients.gameSession
      .getGameSession(gameSessionId)
      .then((fetchedGame) => {
        if (!fetchedGame || !fetchedGame.id) {
          setError(`${t('error.connect.gamesessionerror')}`);
          setIsLoading(false);
          return;
        }
        if (!ignore) setGameSession(fetchedGame);
        setIsLoading(false);
        gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
          fetchedGame.id,
          (response) => {
            console.log(response);
            if (!response) {
              setError(`${t('error.connect.subscriptionerror')}`);
              return;
            }
            if (!ignore) setHasRejoined(false);
            // checks if host has added time via button
            const prevTime = gameSession?.currentTimer ?? 0;
            const newTime = response.currentTimer;
            if (newTime > prevTime) {
              setIsAddTime((prev) => !prev);
            }
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
            console.log(response);
            setCurrentTime(()=> calculateCurrentTime(response));
            // updates team score in the phase 1 and 2 discuss states
            if (response.currentState === GameSessionState.PHASE_1_DISCUSS || response.currentState === GameSessionState.PHASE_2_DISCUSS) {
              setNewPoints(0);
              const currentQuestionIndex = response.currentQuestionIndex ?? 0;
              const currentQuestion = response.questions[currentQuestionIndex];
              
              const currentTeam = response.teams?.find((team) => team.id === teamId);
              const currName = currentTeam?.name;
              if (!currentTeam) {
                console.error('Team not found');
                return;
              }
              
              const isShortAnswerEnabled = false; 

              let calcNewScore = 0;
              if (!hasRejoined) {
                  calcNewScore = ModelHelper.calculateBasicModeScoreForQuestion(
                    response,
                    currentQuestion,
                    currentTeam,
                    isShortAnswerEnabled
                  );
              }
              const prevScore = currentTeam?.score ?? 0;
              updateTeamScore(teamId, prevScore, calcNewScore); 
            }
          }
        );

        teamsSubscription = apiClients.team.subscribeDeleteTeam(gameSessionId, (deletedTeam: ITeam) => { 
          if (deletedTeam.id === teamId) {
            setHasRejoined(false);
            window.localStorage.removeItem(StorageKey);
            window.localStorage.removeItem(StorageKeyAnswer);
            teamsSubscription.unsubscribe();
            window.location.replace((`https://play.rightoneducation.com`));
          }
      })
      })
      .catch((e) => {
        setIsLoading(false);
        if (e instanceof Error) setError(e.message);
        else setError(`${t('error.connect.gamesessionerror')}`);
      });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // eslint-disable-next-line consistent-return
    return () => {
      ignore = true;
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe) {
        gameSessionSubscription.unsubscribe();
      }
      if (teamsSubscription && teamsSubscription.unsubscribe) {
        teamsSubscription.unsubscribe();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameSessionId, apiClients, t, retry, hasRejoined, teamId]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(currentTime);
  return { isLoading, error, gameSession, hasRejoined, newPoints, currentTime, isAddTime };
}
