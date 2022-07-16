import React, { useState } from 'react';
import { Button } from '@mui/material'
import { ApiClient, Environment } from '@righton/networking'
import { IGameSession } from '@righton/networking'

function App() {
  const [gameSession, setGameSession] = useState<IGameSession | null>()
  const [error, setError] = useState<string | null>(null)
  return (
    <div>
      <span>
        {
          (gameSession == null ? "" : gameSession.id) +
          (error == null ? "" : error)
        }
      </span>
      <Button
        variant="contained"
        onClick={() => {
          let apiClient = new ApiClient(Environment.Staging)
          apiClient.createGameSession(926, false)
            .then(gameSession => {
              setGameSession(gameSession)
              setError(null)
            }).catch(error => {
              console.error(error.message)
              setGameSession(null)
              setError(error.message)
            })
        }}
      >
        Create game session
      </Button>
    </div>
  );
}

export default App;
