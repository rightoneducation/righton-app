// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import StartGame from "../pages/StartGame";
import StudentViews from "../pages/StudentViews";
import {
  ApiClient,
  Environment,
  GameSessionState,
  IGameSession,
  ITeam
} from "@righton/networking";
import GameInProgress from "../pages/GameInProgress";
import Ranking from "../pages/Ranking";
import { isCompositeComponent } from "react-dom/test-utils";
import { responsiveFontSizes } from "@material-ui/core";

const GameSessionContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  const [teamsArray, setTeamsArray] = useState([{}]);
  
  const apiClient = new ApiClient(Environment.Staging);

  let { gameSessionId } = useParams<{ gameSessionId: string }>();

  useEffect(() => {
    apiClient.getGameSession(gameSessionId).then(response => {
      setGameSession(response);
    });

    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSessionId, response => {
      setGameSession(({ ...gameSession, ...response }));
    });

    // @ts-ignore
    return () => gameSessionSubscription?.unsubscribe();
  }, []);

  const handleUpdateGameSession = (newUpdates: Partial<IGameSession>) => {
    apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
      .then(response => {
        setGameSession(response);
      });
  };

  // to do
  // for each team in this array, set up a subscription by the team id  using a foreach loop
  // do this by calling subscribeUpdateTeamMember and supplying a callback 
  // updating the state here for the one teammember
      
      
  const handleStartGame = () =>{
    const teamDataRequests = gameSession.teams.map(team => {
      return apiClient.getTeam(team.id);
    });

    Promise.all(teamDataRequests)
      .then(responses => {
      setTeamsArray(responses);
      handleUpdateGameSession({currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0})
    })
      .catch(reason => console.log(reason));
  };

  //could update game session on line 72-73 

 
  if (!gameSession) {
    return null;
  };

  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING:
      return <StartGame {...gameSession} gameSessionId={gameSession.id} handleStartGame={handleStartGame} />;

    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
      return <GameInProgress {...gameSession} teamsArray={teamsArray} handleUpdateGameSession={handleUpdateGameSession}/>;


    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_START:
    case GameSessionState.PHASE_2_RESULTS:
      return <StudentViews {...gameSession} handleUpdateGameSession={handleUpdateGameSession}/>;


    case GameSessionState.FINAL_RESULTS:
      return <Ranking {...gameSession} gameSessionId={gameSession.id} handleUpdateGameSession={handleUpdateGameSession} />;

    default:
      return <Redirect to="/" />;
  }
};

export default GameSessionContainer;


