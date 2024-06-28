import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isNullOrUndefined,
  IAPIClients,
  IGameSession,
  ModelHelper,
  GameSessionState,
} from '@righton/networking';

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

  // added
  const [isError, setIsError] = useState<{ error: boolean; withheldPoints: number }>({ error: false, withheldPoints: 0 });
  const [newPoints, setNewPoints] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    let gameSessionSubscription: any;

    if (retry > 0) {
      setIsLoading(true);
      setError('');
    }

    if (!gameSessionId) {
      setError(`${t('error.connect.gamesessionerror')}`);
      setIsLoading(false);
      return;
    }

    // added. put the +7 in here bc i dont know if i should pass in score
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
            if (!response) {
              setError(`${t('error.connect.subscriptionerror')}`);
              return;
            }
            if (!ignore) setHasRejoined(false);
            setGameSession((prevGame) => ({ ...prevGame, ...response }));
            
            // updates team score in the phase 1 and 2 discuss states
            if (response.currentState === GameSessionState.PHASE_1_DISCUSS || response.currentState === GameSessionState.PHASE_2_DISCUSS) {
              console.log("PHASE_1_DISCUSS or PHASE_2_DISCUSS found");
              setNewPoints(0);
              const currentQuestionIndex = response.currentQuestionIndex ?? 0;
              const currentQuestion = response.questions[currentQuestionIndex];
              // const teamId = '46499047-59db-4ebc-a7ff-695b8d327d99';
              
              const currentTeam = response.teams?.find((team) => team.id === teamId);
              const currName = currentTeam?.name;
              console.log(currName);
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
                  console.log("newscore", calcNewScore);
              }
              const prevScore = currentTeam?.score ?? 0;
              updateTeamScore(teamId, prevScore, calcNewScore); // Use appropriate team ID
            }
          }
        );
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
    };
  }, [gameSessionId, apiClients, t, retry, hasRejoined, teamId]);

  return { isLoading, error, gameSession, hasRejoined, newPoints };
}
