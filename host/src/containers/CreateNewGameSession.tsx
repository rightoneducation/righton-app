import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IAPIClients, GameSessionState, PublicPrivateType } from '@righton/networking';
import LoadingIndicator from '../components/LoadingIndicator';
import { makeStyles } from '@material-ui/core';

interface CreateNewGameSessionProps {
  apiClients: IAPIClients;
}

const CreateNewGameSession = ({apiClients}:CreateNewGameSessionProps) => {
  const classes = useStyles();
  let { gameId, publicPrivate } = useParams<{ gameId: string, publicPrivate: PublicPrivateType }>();
  useEffect(() => {
    apiClients.gameSession.createGameSessionFromTemplate(gameId, publicPrivate).then((response) => {
      if (!response) {
        return;
      }
      apiClients.gameSession
        .updateGameSession({
          id: response,
          currentState: GameSessionState.TEAMS_JOINING,
        })
        .then((response) => {
          window.location.replace(`/host/${response.id}`);
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.text}> Launching Game...</div>
      <div className={classes.loader}>
        <LoadingIndicator
          theme={[
            'rgb(126, 90, 175)',
            'rgb(148, 98, 179)',
            'rgb(169, 104, 180)',
            'rgb(186, 107, 177)',
            'rgb(202, 109, 172)',
            'rgb(218, 112, 168)',
            'rgb(237, 115, 166)',
            'rgb(255, 120, 165)',
          ]}
          radius={110}
          timerStartInSecond={100}
          handleStartGameModalTimerFinished={false}
          gameCreate={true}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  },
  loader: {
    display: 'block',
  },
  text: {
    disply: 'block',
    textAlign: 'center',
    color: 'white',
    position: 'absolute',
    fontFamily: 'Karla',
    fontWeight: 'bold',
    fontSize: '72px',
  },
}));

export default CreateNewGameSession;
