import React, { useState, useReducer, useEffect } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers } from '@righton/networking';
import { APIClientsContext } from '../../lib/context/ApiClientsContext';
import { LocalGameSessionContext, LocalGameSessionDispatchContext } from '../../lib/context/LocalGameSessionContext';
import { GameSessionReducer } from '../../lib/reducer/GameSessionReducer';
import { LocalHostTeamAnswersContext, LocalHostTeamAnswersDispatchContext } from '../../lib/context/LocalHostTeamAnswersContext';
import { HostTeamAnswersReducer } from '../../lib/reducer/HostTeamAnswersReducer';
import GameInProgress from '../../pages/GameInProgress';
import StartGame from '../../pages/StartGame';
import Leaderboard from '../../pages/Leaderboard';
import EndGameLobby from '../../pages/EndGameLobby';
import PrepareGame from '../../pages/PrepareGame';

interface GameSessionContainerProps {
  apiClients: APIClients;
  backendGameSession: IGameSession;
  backendHostTeamAnswers: IHostTeamAnswers;
}

export default function GameSessionContainer({apiClients, backendGameSession, backendHostTeamAnswers}: GameSessionContainerProps) {
  const [localGameSession, dispatch] = useReducer(GameSessionReducer, backendGameSession);
  const [localHostTeamAnswers, dispatchHostTeamAnswers] = useReducer(HostTeamAnswersReducer, backendHostTeamAnswers);
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
  const [isGamePrepared, setIsGamePrepared] = useState<boolean>(false);
  useEffect(() => {
    dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {hostTeamAnswers: backendHostTeamAnswers}});
  }, [backendHostTeamAnswers]);
  const handleDeleteTeam = (teamId: string) => {
    // replace this with an integrated local + backendGameSession in the custom hook
    const updatedTeams = localGameSession.teams.filter((team) => team.id !== teamId);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };
  useEffect(() => {
    dispatch({type: 'synch_local_gameSession', payload: {gameSession: backendGameSession}});
  }, [backendGameSession]);
  const gameTemplates = null;
  // check which phase to get the right allotttted time
  let allottedTime = 0; // Initialize to default value

  if (localGameSession) {
    const { currentState, phaseOneTime, phaseTwoTime } = localGameSession;
    if (currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
      allottedTime = phaseOneTime;
    } else if (currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
      allottedTime = phaseTwoTime;
    }
    console.log("allotted time");
    console.log(allottedTime);
  }
  const calculateCurrentTime = () => {
    if (localGameSession) {
      const getStartTime = localGameSession?.startTime;
      console.log("starttime from host_v2 gamesessioncontainer");
      console.log(getStartTime);
      console.log(allottedTime);
      if (getStartTime) {
        const isoTimeMillis = new Date(getStartTime).getTime();
        const difference = Date.now() - isoTimeMillis;

        if (difference >= allottedTime * 1000) {
          // setCurrentTime(-1);
          return -1;
        } 
        const remainingTime = allottedTime - Math.trunc(difference / 1000);
        // setCurrentTime(remainingTime);
        // window.localStorage.setItem('currentTime', remainingTime.toString());
        console.log(remainingTime);
        return remainingTime;
      }
    }
    return allottedTime;
  };
  let renderContent;
 
  const teamsJoiningPages = [
      !isGamePrepared 
      ? <StartGame
          teams={localGameSession.teams}
          questions={localGameSession.questions}
          title={localGameSession.title }
          gameCode={localGameSession.gameCode}
          currentQuestionIndex={localGameSession.currentQuestionIndex}
          handleDeleteTeam={handleDeleteTeam}
          setIsGamePrepared={setIsGamePrepared}
        /> 
        : <PrepareGame isGamePrepared={isGamePrepared} setIsTimerVisible={setIsTimerVisible}/>
  ];

  switch (localGameSession.currentState) {
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
    case GameSessionState.PHASE_2_START:
      renderContent = (
        <GameInProgress
          isTimerVisible={isTimerVisible}
          setIsTimerVisible={setIsTimerVisible} 
          currentTimer={calculateCurrentTime()}
          isCorrect={false}
          isIncorrect={false}
          totalTime={100}
          hasRejoined={false}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          localHostTeamAnswers={localHostTeamAnswers}
        />
      );
      break;
    case GameSessionState.FINAL_RESULTS:
      renderContent = (
        <Leaderboard 
            teams={localGameSession.teams}
            questions={localGameSession.questions}
            currentQuestionIndex={localGameSession.currentQuestionIndex}
            title={localGameSession.title}
            handleDeleteTeam={handleDeleteTeam}
        />
      );
      break;
    case GameSessionState.FINISHED:
      renderContent = (
        <EndGameLobby 
        teams={localGameSession.teams} 
        gameTemplates={gameTemplates} 
        gameCode={localGameSession.gameCode} 
        currentQuestionIndex={localGameSession.currentQuestionIndex} 
        handleDeleteTeam={handleDeleteTeam}
      />
      );
      break;
    case GameSessionState.TEAMS_JOINING:
    default:
      renderContent = (
        localGameSession.currentQuestionIndex === null 
        ? teamsJoiningPages
        : <Leaderboard 
            teams={localGameSession.teams}
            questions={localGameSession.questions}
            currentQuestionIndex={localGameSession.currentQuestionIndex}
            title={localGameSession.title}
            handleDeleteTeam={handleDeleteTeam}
          />
      );
      break;
  }

  return (
    <APIClientsContext.Provider value={apiClients}>
      <LocalHostTeamAnswersContext.Provider value={localHostTeamAnswers}>
        <LocalHostTeamAnswersDispatchContext.Provider value={dispatchHostTeamAnswers}>
          <LocalGameSessionContext.Provider value={localGameSession}>
            <LocalGameSessionDispatchContext.Provider value={dispatch}>
              {localGameSession && localHostTeamAnswers && renderContent}
            </LocalGameSessionDispatchContext.Provider>
          </LocalGameSessionContext.Provider>
        </LocalHostTeamAnswersDispatchContext.Provider>
      </LocalHostTeamAnswersContext.Provider>
    </APIClientsContext.Provider>
  )
}
