// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import StartGame from "../pages/StartGame";
import StudentViews from "../pages/StudentViews";
import {
  ApiClient,
  Environment,
  GameSessionState,
  IGameSession
} from "@righton/networking";
import GameInProgress from "../pages/GameInProgress";
import Ranking from "../pages/Ranking";
import { isCompositeComponent } from "react-dom/test-utils";
import { responsiveFontSizes } from "@material-ui/core";
import { AMPLIFY_SYMBOL } from "@aws-amplify/pubsub/lib-esm/Providers/constants";

const GameSessionContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  const [teamsArray, setTeamsArray] = useState([{}]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClient = new ApiClient(Environment.Staging);
  const stateArray = Object.values(GameSessionState); //adds all states from enum into array 

  let { gameSessionId } = useParams<{ gameSessionId: string }>();

  useEffect(() => {
    apiClient.getGameSession(gameSessionId).then(response => {
    setGameSession(response);
   
      // if (!response.currentState === "TEAMS_JOINING" || !response.currentState === "NOT_STARTED" )
      // {
        

      //   let teamDataRequests = gameSession.teams.map(team => {
      //     return apiClient.getTeam(team.id);
      //    });
  
      //   Promise.all(teamDataRequests)
      //     .then(responses => {
      //         responses.forEach(response => {
      //         let teamMemberSubscription: any | null = null;
      //           teamMemberSubscription = apiClient.subscribeUpdateTeamMember(response.teamMembers.id, teamMemberResponse => {
      //             responses.forEach(team => {
      //               response.teamMembers.items.forEach(teamMemberOriginal => { 
      //                 if (teamMemberOriginal.id === teamMemberResponse.id){
      //                   teamMemberOriginal = Object.assign(teamMemberOriginal, teamMemberResponse); 
      //                 }
      //               })
      //             }); 
      //           });
      //         });
      //         setTeamsArray(responses); //last thing we do is update state so we don't have to wait for it to be updated
      //     })
      // }
    });
    

     
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSessionId, response => {
      setGameSession(({ ...gameSession, ...response }));
    });

    // @ts-ignore
    return () => gameSessionSubscription?.unsubscribe();
  }, []);

  useEffect(()=>{
    if (isModalOpen){
      document.body.style.overflow = 'hidden';
    }
    else{
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const handleBeginGameSession = (newUpdates: Partial<IGameSession>) => {
    apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
      .then(response => {
        setGameSession(response);
        setIsModalOpen(false);
      });
  };

  const handleUpdateGameSession = (newUpdates: Partial<IGameSession>) => {
    apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
      .then(response => {
        setGameSession(response);
      });
  };

  const handleTimerFinished = () =>{
   handleBeginGameSession({currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0});
  }
      
  const handleStartGame = () =>{
    console.log(gameSession.currentState);  //I'm keeping this in until we figure out NOT_STARTED so we can tell there's been a change in state 
    if (gameSession.currentState === stateArray[1])
    {
      setIsTimerActive(true);
      setIsModalOpen(true);
    
      const teamDataRequests = gameSession.teams.map(team => {
        return apiClient.getTeam(team.id);
      });

      Promise.all(teamDataRequests)
        .then(responses => {
            responses.forEach(response => {
            let teamMemberSubscription: any | null = null;
              teamMemberSubscription = apiClient.subscribeUpdateTeamMember(response.teamMembers.id, teamMemberResponse => {
                responses.forEach(team => {
                  response.teamMembers.items.forEach(teamMemberOriginal => { 
                    if (teamMemberOriginal.id === teamMemberResponse.id){
                      teamMemberOriginal = Object.assign(teamMemberOriginal, teamMemberResponse); 
                    }
                  })
                }); 
              });
            });
            setTeamsArray(responses); //last thing we do is update state so we don't have to wait for it to be updated
        })
        .catch(reason => console.log(reason));
    }
    else
      handleUpdateGameSession({currentState: GameSessionState.TEAMS_JOINING, currentQuestionIndex: 0});
  };

  if (!gameSession) {
    return null;
  };

  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING:
      return <StartGame {...gameSession} gameSessionId={gameSession.id} isTimerActive={isTimerActive} isModalOpen={isModalOpen} handleTimerFinished={handleTimerFinished} handleStartGame={handleStartGame}/>;

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


