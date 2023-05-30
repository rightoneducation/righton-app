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
import { ContactsOutlined } from "@material-ui/icons";

const GameSessionContainer = () => {
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  const [teamsArray, setTeamsArray] = useState([{}]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiClient = new ApiClient(Environment.Staging);
  const [headerGameCurrentTime, setHeaderGameCurrentTime] = React.useState(localStorage.getItem('currentGameTimeStore'));
  const [gameTimer, setGameTimer] = useState(false);
  const [gameTimerZero, setGameTimerZero] = useState(false);

  let { gameSessionId } = useParams<{ gameSessionId: string }>();

  // initial query for gameSessions and teams
  useEffect(() => {
    apiClient.getGameSession(gameSessionId).then(response => {
      setGameSession(response); // set initial gameSession state
      checkGameTimer(response); // checks if the timer needs to start

      // the below sets up the teamsArray - this is necessary as it allows us to view the answers fields (at an inaccessible depth with the gameSessionObject)
      const teamDataRequests = response.teams.map(team => {
        return apiClient.getTeam(team.id); // got to call the get the teams from the APi so we can see the answers
      });

      Promise.all(teamDataRequests)
        .then(responses => {
          setTeamsArray(responses);
        })
        .catch(reason => console.log(reason));
    });

    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(gameSessionId, response => {
      // only run the gametimer check on instances where the currentState changes (new screens)
      if (gameSession && gameSession.currentState !== response.currentState) {
        checkGameTimer(response);
      }

      setGameSession({ ...gameSession, ...response });
    });

    // set up subscription for new teams joining
    let createTeamSubscription: any | null = null;
    createTeamSubscription = apiClient.subscribeCreateTeam(gameSessionId, teamResponse => {
      if (teamResponse.gameSessionTeamsId === gameSessionId) {
        setGameSession((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.teams.push(teamResponse);
          return newState;
        });
      }
    });

    // set up subscription for teams leaving
    let deleteTeamSubscription: any | null = null;
    deleteTeamSubscription = apiClient.subscribeDeleteTeam(gameSessionId, teamResponse => {
      if (teamResponse.gameSessionTeamsId === gameSessionId) {
        setGameSession((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          let teamsFiltered = newState.teams.filter(value => (value.id !== teamResponse.id));
          newState.teams = teamsFiltered;
          return newState;
        });
      }
    });

    // set up subscription for teams answering
    let createTeamAnswerSubscription: any | null = null;
    createTeamAnswerSubscription = apiClient.subscribeCreateTeamAnswer(gameSessionId, teamAnswerResponse => {
      setTeamsArray((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.forEach(team => {
          team.teamMembers && team.teamMembers.forEach(teamMember => {
            if (teamMember.id === teamAnswerResponse.teamMemberAnswersId)
              teamMember.answers.push(teamAnswerResponse);
          });
        });
        return newState;
      });
    });

    // @ts-ignore
    return () => {
      gameSessionSubscription?.unsubscribe();
      createTeamSubscription.unsubscribe();
      deleteTeamSubscription.unsubscribe();
      createTeamAnswerSubscription.unsubscribe();
    }

  }, []);

  // stops scrolling on the startgame modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);


  // headerGame timer, 1 second interval, update localstorage in case page resets
  useEffect(() => {
    if (gameTimer && !gameTimerZero) {
      let refreshIntervalId = setInterval(() => {
        if (headerGameCurrentTime > 0) {
          setHeaderGameCurrentTime(headerGameCurrentTime - 1);
          localStorage.setItem('currentGameTimeStore', headerGameCurrentTime - 1);
        }
        else
          setGameTimerZero(true);
      }, 1000);
      return () => clearInterval(refreshIntervalId);
    }
  }, [gameTimer, gameTimerZero, headerGameCurrentTime]);

  // update gameSession currentTimer every 3 seconds with time from headerGame Timer 
  useEffect(() => {
    if (gameTimer && !gameTimerZero) {
      let refreshIntervalId = setInterval(() => {
        let newUpdates = { currentTimer: (localStorage.getItem('currentGameTimeStore') >= 0 ? localStorage.getItem('currentGameTimeStore') : 0) };
        //removing this until we smooth out mobile, want to avoid clogging mobile with more gameSessionUpdates than necessary.
        //apiClient.updateGameSession({ id: gameSessionId, ...newUpdates });
      }, 3000);
      return () => clearInterval(refreshIntervalId);
    }
  }, [gameTimer, gameTimerZero]);

  const handleUpdateGameSession = (newUpdates: Partial<IGameSession>) => {
    apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
      .then(response => {

        if (response.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
          setHeaderGameCurrentTime(response.phaseOneTime);
        }
        else if (response.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER)
          setHeaderGameCurrentTime(response.phaseTwoTime);

        setGameSession(response);
        checkGameTimer(response);


      });
  };

  const checkGameTimer = (gameSession) => {
    if (gameSession.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER && gameSession.currentState !== GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
      setGameTimer(false);
      setGameTimerZero(false);
    }
    else {
      setGameTimer(true);
      setGameTimerZero(false);
    }
  };

  const handleStartGameModalTimerFinished = () => {
    let newUpdates = { currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0 };
    apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
      .then(response => {
        localStorage.setItem('currentGameTimeStore', gameSession.phaseOneTime);
        setHeaderGameCurrentTime(gameSession.phaseOneTime);
        checkGameTimer(response);
        setGameSession(response);

        const teamDataRequests = response.teams.map(team => {
          return apiClient.getTeam(team.id); // got to call the get the teams from the API so we can see the answers
        });

        Promise.all(teamDataRequests)
          .then(responses => {
            setTeamsArray(responses);
            setIsModalOpen(false);
          })
          .catch(reason => console.log(reason));
      });

  };

  const handleStartGame = () => {
    // I'm keeping this console.log in until we figure out NOT_STARTED so we can tell there's been a change in state 
    console.log(gameSession.currentState);
    console.log("CONNECTED TO HOST");
    if (gameSession.currentState === GameSessionState.TEAMS_JOINING) {
      // setIsTimerActive(true);
      // setIsModalOpen(true);
      handleUpdateGameSession({ currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0 });
      setIsTimerActive(true);
      setIsModalOpen(true);
    }
    // else {
    //   handleUpdateGameSession({ currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, currentQuestionIndex: 0 });
    // }
  };

  if (!gameSession) {
    return null;
  };

  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING:
      return <StartGame {...gameSession} gameSessionId={gameSession.id} isTimerActive={isTimerActive} isModalOpen={isModalOpen} handleStartGameModalTimerFinished={handleStartGameModalTimerFinished} handleStartGame={handleStartGame} />;
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
      if (isModalOpen) {
        return <StartGame {...gameSession} gameSessionId={gameSession.id} isTimerActive={isTimerActive} isModalOpen={isModalOpen} handleStartGameModalTimerFinished={handleStartGameModalTimerFinished} handleStartGame={handleStartGame} />;
      }
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
      return <GameInProgress {...gameSession} teamsArray={teamsArray} handleUpdateGameSession={handleUpdateGameSession} headerGameCurrentTime={headerGameCurrentTime} gameTimer={gameTimer} gameTimerZero={gameTimerZero} />;

    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_START:
    case GameSessionState.PHASE_2_RESULTS:
      return <StudentViews {...gameSession} gameTimer={gameTimer} handleUpdateGameSession={handleUpdateGameSession} />;


    case GameSessionState.FINAL_RESULTS:
      return <Ranking {...gameSession} gameSessionId={gameSession.id} handleUpdateGameSession={handleUpdateGameSession} />;

    default:
      return <Redirect to="/" />;
  }
};

export default GameSessionContainer;


