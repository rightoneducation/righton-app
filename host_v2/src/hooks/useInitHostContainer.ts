import { useState, useEffect } from 'react';
import { APIClients, IGameSession } from '@righton/networking';

export default function useInitHostContainer(apiClients: APIClients, gameSessionId: string): IGameSession | null{
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  useEffect(() => {
    
    const fetchGameSession = async () => {
      try {
        const response = await apiClients.gameSession.getGameSession(gameSessionId);
        setGameSession(response); // Set the game session data in state
        console.log(response);
      } catch (error) {
        console.error('error fetching game session:', error);
      }
    };
    
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
      gameSessionId,
      (response) => {
        setGameSession((prev) => ({ ...prev, ...response }));
      },
    );

    fetchGameSession();
    return () => {
      if (gameSessionSubscription && gameSessionSubscription.unsubscribe)
        gameSessionSubscription.unsubscribe();
    };
  }, [apiClients, gameSessionId]);
  return gameSession;
}