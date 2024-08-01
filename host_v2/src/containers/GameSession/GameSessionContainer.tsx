import React, { useState, useReducer, useEffect } from 'react';
import { GameSessionState, IGameSession, APIClients, IHostTeamAnswers, HostDataManagerAPIClient } from '@righton/networking';
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
  const [currentTimer, setCurrentTimer] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  useEffect(() => {
    dispatchHostTeamAnswers({type: 'synch_local_host_team_answers', payload: {hostTeamAnswers: backendHostTeamAnswers}});
  }, [backendHostTeamAnswers]);
  const handleDeleteTeam = (teamId: string) => {
    // replace this with an integrated local + backendGameSession in the custom hook
    const updatedTeams = localGameSession.teams.filter((team) => team.id !== teamId);
    dispatch({type: 'update_teams', payload: {teams: updatedTeams}});
    apiClients?.hostDataManager?.deleteTeam(teamId, (updatedGameSession: IGameSession) => dispatch({type: 'synch_local_gameSession', payload: {gameSession: updatedGameSession}}));
  };

  const calculateCurrentTime = (gameSession: IGameSession) => {
    let initialTime = 0;
    if (gameSession) {
      if (gameSession?.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
        initialTime = gameSession?.phaseOneTime;
      } else if (gameSession?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
        initialTime = gameSession?.phaseTwoTime;
      }
      setTotalTime(initialTime);
      const getStartTime = Number(gameSession?.startTime);
      if (getStartTime) {
        const difference = Date.now() - getStartTime;
        if (difference >= initialTime * 1000) {
          return 0;
        } 
        const remainingTime = initialTime - Math.trunc(difference / 1000);
        return remainingTime;
      }
    }
    return initialTime;
  };

  const handleAddTime = () => {
    const addedTime = 30;
    let addedStartTime = addedTime * 1000;
    let newTime = currentTimer + addedTime;
    if (newTime > totalTime) {
      newTime = totalTime;
      addedStartTime = totalTime * 1000 - currentTimer * 1000;
    }
    const newStartTime = Number(localGameSession.startTime) + addedStartTime;
    setCurrentTimer(newTime);
    apiClients?.hostDataManager?.updateTime(newStartTime);
  }

  useEffect(() => {
    if (backendGameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || backendGameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
      setCurrentTimer(calculateCurrentTime(backendGameSession));
    }
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
  }

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
          currentTimer={currentTimer}
          isCorrect={false}
          isIncorrect={false}
          totalTime={totalTime}
          hasRejoined={false}
          localModelMock={{hasRejoined: false, currentTimer: 100}}
          localHostTeamAnswers={localHostTeamAnswers}
          handleAddTime={handleAddTime}
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
