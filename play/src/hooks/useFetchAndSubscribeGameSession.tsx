import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IAPIClients,
  IGameSession,
  ITeam,
  ModelHelper,
  GameSessionState,
} from '@righton/networking';
import { StorageKey, StorageKeyAnswer} from '../lib/PlayModels';
import { calculateCurrentTime } from '../lib/HelperFunctions';

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

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      setCurrentTime(calculateCurrentTime(gameSession ?? null));
    }
  };

  /* we have this in a separate useEffect so that it avoids any closure
   * issues with the gameSession object
   */
  useEffect(() => {
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameSession]); // eslint-disable-line react-hooks/exhaustive-deps
  

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
    // added so we can update the score for the discuss page. (previously implemented in results pages we got rid of)
    const updateTeamScore = async (inputTeamId: string, prevScore: number, newScore: number) => {
      try {
        console.log('sup');
        const response = await apiClients.team.updateTeam({ id: inputTeamId, score: newScore + prevScore });
        console.log('updateTeamscore');
        console.log(response);
        setNewPoints(newScore);
      } catch (e) {
        console.log(e);
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
        setCurrentTime(calculateCurrentTime(fetchedGame));
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
            const prevTime = gameSession?.startTime ?? 0;
            const newTime = response.startTime;
            if (newTime > prevTime) {
              setIsAddTime((prev) => !prev);
            }
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
            setCurrentTime(calculateCurrentTime(response));
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
                  console.log(calcNewScore);
              }
              const prevScore = currentTeam?.score ?? 0;
              console.log('inside useEffect');
              console.log(calcNewScore);
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
            window.location.replace((`https://dev-play.rightoneducation.com`));
          }
      })
      })
      .catch((e) => {
        setIsLoading(false);
        if (e instanceof Error) setError(e.message);
        else setError(`${t('error.connect.gamesessionerror')}`);
      });

    // eslint-disable-next-line consistent-return
    return () => {
      ignore = true;
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe) {
        gameSessionSubscription.unsubscribe();
      }
      if (teamsSubscription && teamsSubscription.unsubscribe) {
        teamsSubscription.unsubscribe();
      }
    };
  }, [gameSessionId, apiClients, t, retry, hasRejoined, teamId]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log("outside of useEffect");
  console.log(newPoints);
  return { isLoading, error, gameSession, hasRejoined, newPoints, currentTime, isAddTime };
}
