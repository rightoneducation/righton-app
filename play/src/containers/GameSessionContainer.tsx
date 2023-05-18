import React, { useState } from 'react';
import {
  ApiClient,
  IGameSession,
  GameSessionState,
  IQuestion,
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import JoinGameContainer from './JoinGameContainer';
import GameInProgressContainer from './GameInProgressContainer';
import { JoinBasicGameData } from '../lib/PlayModels';

interface GameSessionContainerProps {
  apiClient: ApiClient;
}

export default function GameSessionContainer({ apiClient }: GameSessionContainerProps) {
  const [currentState, setCurrentState] = useState(GameSessionState.TEAMS_JOINING); 
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [teamId, setTeamId] = useState<string>('');
  const [teamMemberId, setTeamMemberID] = useState<string>('');
  const [teamAvatar, setTeamAvatar] = useState<number>(0);

  const subscribeToGame = (gameSessionId: string) => {
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription =  apiClient.subscribeUpdateGameSession(gameSessionId, response => { 
      setGameSession({ ...gameSession, ...response });
      setCurrentState(response.currentState);
    });
    console.debug(`subscribed to game session with id: ${gameSessionId}`);
    return () => {
      gameSessionSubscription?.unsubscribe();
    };
  };

  const addTeamToGame = async (joinBasicGameData: JoinBasicGameData) => {
    const teamName = `${joinBasicGameData.firstName} ${joinBasicGameData.lastName}`;
    try {
      const team = await apiClient.addTeamToGameSessionId(joinBasicGameData.gameSessionId, teamName, null)
      setTeamId(team.id);
      if (!team) {
        console.error("Failed to add team")
      }
      else {
        apiClient.addTeamMemberToTeam(team.id, true, uuidv4())
        .then((teamMember) => {
          if (!teamMember) {
            console.error("Failed to add team member")
          }
          setTeamMemberID(teamMember.id);
        }).catch((error) => {
          console.error(error);
        });
      }
    }
    catch (error) {
      console.error(error)
    }
  };

  const addTeamAnswerToTeamMember = async (question: IQuestion, answerText: string, gameSessionState: GameSessionState) => {
    try{
      await apiClient.addTeamAnswer(
        teamMemberId,
        question.id,
        answerText,
        gameSessionState === GameSessionState.CHOOSE_CORRECT_ANSWER,
        gameSessionState !== GameSessionState.CHOOSE_CORRECT_ANSWER
     )
    }
    catch (error) {
      console.error(error)
    }
  };

  const updateTeamScore = async (inputTeamId: string, inputScore: number) => {
    try {
      await apiClient.updateTeam({id: inputTeamId, score: inputScore});
    }
    catch (error) {
      console.error(error)
    }
  };

  // when a player selects a team avatar, we need to add them to the game and subscribe to the game session
  // TODO: add in rejoin functionality, starting here 
  const handleJoinBasicGameFinished = (joinBasicGameData: JoinBasicGameData) => {
    setTeamAvatar(joinBasicGameData.selectedAvatar);
    addTeamToGame(joinBasicGameData);
    subscribeToGame(joinBasicGameData.gameSessionId);
  };

  switch (currentState) {
    case GameSessionState.TEAMS_JOINING:
    case GameSessionState.FINISHED:
      return 
        <JoinGameContainer handleJoinGameFinished={(joinBasicGameData) => handleJoinBasicGameFinished(joinBasicGameData)}/>
    default:
      return (
        gameSession && 
        <GameInProgressContainer teamId={teamId} gameSession={gameSession} currentState={currentState} setCurrentState={setCurrentState} teamAvatar={teamAvatar} addTeamAnswerToTeamMember={addTeamAnswerToTeamMember} updateTeamScore={updateTeamScore}/>
      );
  }
}
