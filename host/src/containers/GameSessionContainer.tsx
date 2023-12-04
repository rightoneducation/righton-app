// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import StartGame from '../pages/StartGame';
import StudentViews from '../pages/StudentViews';
import {
  ApiClient,
  Environment,
  GameSessionState,
  IGameSession,
  IHints,
  isNullOrUndefined,
} from '@righton/networking';
import GameInProgress from '../pages/GameInProgress';
import Ranking from '../pages/Ranking';
import { buildShortAnswerResponses, getQuestionChoices, getTeamInfoFromAnswerId } from '../lib/HelperFunctions';

const GameSessionContainer = () => {
  // refs for scrolling of components via module navigator
  const questionCardRef = React.useRef(null);
  const responsesRef = React.useRef(null);
  const gameAnswersRef = React.useRef(null);
  const confidenceCardRef = React.useRef(null);
  const featuredMistakesRef = React.useRef(null);
  const hintCardRef = React.useRef(null);
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  const [teamsArray, setTeamsArray] = useState([{}]);
  // we're going to set this default condition to a query to the question object
  // we're going to update the question object after the shortanswerresponses object is updated in the create team answer subscription
  // we aren't going to subscribe to question objects on either app to prevent a bunch of updates
  // or maybe we just build shortanswerresponses based on reload logic like how we do it in create answer subscription
  const [shortAnswerResponses, setShortAnswerResponses] = useState([]);
  const [hints, setHints] = useState([]);
  const [gptHints, setGptHints] = React.useState(null);
  const [hintsError, setHintsError] = React.useState(false);
  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const apiClient = new ApiClient(Environment.Developing);
  const [headerGameCurrentTime, setHeaderGameCurrentTime] = React.useState(
    localStorage.getItem('currentGameTimeStore'),
  );
  const [gameTimer, setGameTimer] = useState(false);
  const [gameTimerZero, setGameTimerZero] = useState(false);
  const [isConfidenceEnabled, setIsConfidenceEnabled] = useState(false);
  const [isShortAnswerEnabled, setIsShortAnswerEnabled] = useState(false);
  const [isHintEnabled, setIsHintEnabled] = useState(true);
  // module navigator dictionaries for different game states
  const questionConfigNavDictionary = [
    { ref: questionCardRef, text: 'Question Card' },
    { ref: responsesRef, text: 'Responses Settings' },
    { ref: confidenceCardRef, text: 'Confidence Settings' },
    { ref: hintCardRef, text: 'Player Thinking Settings' },
  ];
  const gameplayNavDictionary = [
    { ref: questionCardRef, text: 'Question Card' },
    { ref: responsesRef, text: 'Real-time Responses' },
    { ref: gameAnswersRef, text: 'Answer Explanations' },
  ];
  const [navDictionary, setNavDictionary] = useState(
    questionConfigNavDictionary,
  );
  // assembles fields for module navigator in footer
  const assembleNavDictionary = (isConfidenceEnabled, isHintEnabled, state) => {
    if (state === GameSessionState.TEAMS_JOINING) {
      setNavDictionary(questionConfigNavDictionary);
      return;
    }
    let newDictionary = [...gameplayNavDictionary];
    let insertIndex = 2;
    if (isConfidenceEnabled && (state === GameSessionState.CHOOSE_CORRECT_ANSWER || state === GameSessionState.PHASE_1_DISCUSS)){
      newDictionary.splice(insertIndex, 0, {
        ref: confidenceCardRef,
        text: 'Player Confidence',
      });
      insertIndex++;
    }
    if (isHintEnabled && (state === GameSessionState.CHOOSE_TRICKIEST_ANSWER || state === GameSessionState.PHASE_2_DISCUSS)){
      newDictionary.splice(insertIndex, 0, {
        ref: hintCardRef,
        text: 'Player Thinking',
      });
      insertIndex++;
    }
    if (isShortAnswerEnabled){
      newDictionary.splice(insertIndex, 0, {
        ref: featuredMistakesRef,
        text: 'Featured Mistakes',
      });
      insertIndex++;
    }
    setNavDictionary(newDictionary);
  };

  let { gameSessionId } = useParams<{ gameSessionId: string }>();

  // initial query for gameSessions and teams
  useEffect(() => {
    apiClient.getGameSession(gameSessionId).then((response) => {
      setGameSession(response); // set initial gameSession state
      gameSessionId = response.id; // set gameSessionId to the response id (in case it was a new gameSession)
      checkGameTimer(response); // checks if the timer needs to start
      if (
        !isNullOrUndefined(response) &&
        !isNullOrUndefined(response.currentQuestionIndex) &&
        !isNullOrUndefined(response.questions[response.currentQuestionIndex])
      ) {
        setIsConfidenceEnabled(
          response.questions[response.currentQuestionIndex].isConfidenceEnabled,
        );
        setIsShortAnswerEnabled(response.questions[response.currentQuestionIndex].isShortAnswerEnabled);
        setIsHintEnabled(
          response.questions[response.currentQuestionIndex].isHintEnabled,
        );
        setGptHints(response.questions[response.currentQuestionIndex].hints);
        setHintsError(false);
        assembleNavDictionary(
          response.questions[response.currentQuestionIndex].isConfidenceEnabled,
          response.questions[response.currentQuestionIndex].isHintEnabled,
          response.currentState,
        );
      }
      // the below sets up the teamsArray - this is necessary as it allows us to view the answers fields (at an inaccessible depth with the gameSessionObject)
      const teamDataRequests = response.teams.map((team) => {
        return apiClient.getTeam(team.id); // got to call the get the teams from the APi so we can see the answers
      });

      Promise.all(teamDataRequests)
        .then((responses) => {
          // if shortAnswer is enabled we need to rebuild the shortAnswerResponses object on refresh
          if (response.questions[response.currentQuestionIndex].isShortAnswerEnabled === true) {
            responses.forEach((team) => {
              team.teamMembers && team.teamMembers.forEach((teamMember) => {
                teamMember.answers && teamMember.answers.forEach((answer) => {
                  if (answer.questionId === response.questions[response.currentQuestionIndex].id 
                    && ((response.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || response.currentState === GameSessionState.PHASE_1_DISCUSS) 
                    && answer.isChosen) 
                  ) {
                    setShortAnswerResponses((prev) => {
                     return buildShortAnswerResponses(prev, getQuestionChoices(response.questions, response.currentQuestionIndex), response.questions[response.currentQuestionIndex].answerSettings, answer, team.name)
                   });
                  }
                });
              });
            });
          }
          setTeamsArray(responses);
        })
        .catch((reason) => console.log(reason));
    });

    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClient.subscribeUpdateGameSession(
      gameSessionId,
      (response) => {
        // only run the gametimer check on instances where the currentState changes (new screens)
        if (gameSession && gameSession.currentState !== response.currentState) {
          checkGameTimer(response);
        }
        setHintsError(false);
        setGameSession({ ...gameSession, ...response });
        setIsConfidenceEnabled(
          response.questions[response.currentQuestionIndex].isConfidenceEnabled,
        );
        setIsShortAnswerEnabled(response.questions[response.currentQuestionIndex].isShortAnswerEnabled);
        setShortAnswerResponses(response.questions[response.currentQuestionIndex].responses);
      },
    );

    // set up subscription for new teams joining
    let createTeamSubscription: any | null = null;
    createTeamSubscription = apiClient.subscribeCreateTeam(
      gameSessionId,
      (teamResponse) => {
        if (teamResponse.gameSessionTeamsId === gameSessionId) {
          setGameSession((prevState) => {
            let newState = JSON.parse(JSON.stringify(prevState));
            newState.teams.push(teamResponse);
            return newState;
          });
        }
      },
    );

    // set up subscription for teams leaving
    let deleteTeamSubscription: any | null = null;
    deleteTeamSubscription = apiClient.subscribeDeleteTeam(
      gameSessionId,
      (teamResponse) => {
        if (teamResponse.gameSessionTeamsId === gameSessionId) {
          setGameSession((prevState) => {
            let newState = JSON.parse(JSON.stringify(prevState));
            let teamsFiltered = newState.teams.filter(
              (value) => value.id !== teamResponse.id,
            );
            newState.teams = teamsFiltered;
            return newState;
          });
        }
      },
    );
      
    // set up subscription for teams answering
    let createTeamAnswerSubscription: any | null = null;
    createTeamAnswerSubscription = apiClient.subscribeCreateTeamAnswer(
      gameSessionId,
      (teamAnswerResponse) => {
        // we have to get the gameSession as we're still in the useEffect closure and the gameSession is stale
        apiClient.getGameSession(gameSessionId).then((gameSession) => {
          let choices = getQuestionChoices(gameSession.questions, gameSession.currentQuestionIndex);

          // similarly all state values here are stale so we are going to use functional setting to ensure we're grabbing the most recent state
          setTeamsArray((prevState) => {
            const { teamName, teamId } = getTeamInfoFromAnswerId(prevState, teamAnswerResponse.teamMemberAnswersId);
            const newState = JSON.parse(JSON.stringify(prevState));
            newState.map((team) => {
              if (team.id === teamId) {
                team.teamMembers.map((teamMember) => {
                  if (teamMember.id === teamAnswerResponse.teamMemberAnswersId) {
                    teamMember.answers.push(teamAnswerResponse);
                  }
                });
              }
            })
            if (gameSession.questions[gameSession.currentQuestionIndex].isShortAnswerEnabled && gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
              // we are nesting the short answer response in here because we need to use the teamName and teamId to build the shortAnswerResponses object
              // if we did this outside of the setTeamsArray function we would be using stale state values
              setShortAnswerResponses((prevShortAnswerState) => {
                const newShortAnswerState = buildShortAnswerResponses(prevShortAnswerState, choices, gameSession.questions[gameSession.currentQuestionIndex].answerSettings, teamAnswerResponse, teamName, teamId);
                apiClient
                  .updateQuestion({
                    gameSessionId: gameSession.id, 
                    id: gameSession.questions[gameSession.currentQuestionIndex].id,
                    order: gameSession.questions[gameSession.currentQuestionIndex].order,
                    responses: JSON.stringify(newShortAnswerState),
                });
                return newShortAnswerState;
              });
            }
            return newState;
          });
       });
      },
    );

    // set up subscription for teams confidence answering (update to created team answer)
    let updateTeamAnswerSubscription: any | null = null;
    updateTeamAnswerSubscription = apiClient.subscribeUpdateTeamAnswer(
      gameSessionId,
      (teamAnswerResponse) => {
        let teamName = '';
        setTeamsArray((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.forEach((team) => {
            team.teamMembers &&
              team.teamMembers.forEach((teamMember) => {
                if (teamMember.id === teamAnswerResponse.teamMemberAnswersId) {
                  teamMember.answers.forEach((answer) => {
                    if (answer.id === teamAnswerResponse.id){
                      answer.confidenceLevel =
                        teamAnswerResponse.confidenceLevel;
                      teamName = team.name;
                    }
                  });
                }
              });
          });
          return newState;
        });
        if (!isNullOrUndefined(teamAnswerResponse.hint)) {
          setHints((prevHints) => {return [...prevHints, teamAnswerResponse.hint]});
        }
        setShortAnswerResponses((existingAnswers) => {
          let newShortAnswers = JSON.parse(JSON.stringify(existingAnswers));
          newShortAnswers.forEach((answer) => {
            answer.teams.forEach((answerTeam) => {
              if (answerTeam.name === teamName) {
                answerTeam.confidence = teamAnswerResponse.confidenceLevel;   
              }
            })
          });
          return newShortAnswers;
        });
      },
    );

    // @ts-ignore
    return () => {
      gameSessionSubscription?.unsubscribe();
      createTeamSubscription.unsubscribe();
      deleteTeamSubscription.unsubscribe();
      createTeamAnswerSubscription.unsubscribe();
      updateTeamAnswerSubscription.unsubscribe();
    };
  }, []);

  // stops scrolling on the startgame modal
  useEffect(() => {
    if (isLoadModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoadModalOpen]);

  // headerGame timer, 1 second interval, update localstorage in case page resets
  useEffect(() => {
    if (gameTimer && !gameTimerZero) {
      let refreshIntervalId = setInterval(() => {
        if (headerGameCurrentTime > 0) {
          setHeaderGameCurrentTime(headerGameCurrentTime - 1);
          localStorage.setItem(
            'currentGameTimeStore',
            headerGameCurrentTime - 1,
          );
        } else setGameTimerZero(true);
      }, 1000);
      return () => clearInterval(refreshIntervalId);
    }
  }, [gameTimer, gameTimerZero, headerGameCurrentTime]);

  // update gameSession currentTimer every 3 seconds with time from headerGame Timer
  //removing this until we smooth out mobile, want to avoid clogging mobile with more gameSessionUpdates than necessary.
  // useEffect(() => {
  //   if (gameTimer && !gameTimerZero) {
  //     let refreshIntervalId = setInterval(() => {
  //       let newUpdates = { currentTimer: (localStorage.getItem('currentGameTimeStore') >= 0 ? localStorage.getItem('currentGameTimeStore') : 0) };
  //
  //       //apiClient.updateGameSession({ id: gameSessionId, ...newUpdates });
  //     }, 3000);
  //     return () => clearInterval(refreshIntervalId);
  //   }
  // }, [gameTimer, gameTimerZero]);

  // handles confidence switch changes on Question Config
  const handleConfidenceSwitchChange = (event) => {
    setIsConfidenceEnabled(event.target.checked);
  };

  const handleShortAnswerChange = (event) => {
    setIsShortAnswerEnabled(!isShortAnswerEnabled);
  };

  const handleHintChange = (event) => {
    setIsHintEnabled(!isHintEnabled);
  };

  const handleOnSelectMistake = (value, isTop3) => {
    setSelectedMistakes((prev) => {
      if (prev.includes(value)) {
        if (isTop3 === false)
          return prev.filter(mistake => mistake !== value);
        return prev;
      } else {
        return [...prev, value];
      }
    });
  }
  const handleUpdateGameSession = async (newUpdates: Partial<IGameSession>) => {
    // this will update the response object with confidence and selected mistakes values
    if (
      (isShortAnswerEnabled 
      || isConfidenceEnabled) 
      && gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER
    ){
      const finalResultsContainer = shortAnswerResponses.map((answer) => ({
        ...answer,
        isSelectedMistake: selectedMistakes.includes(answer.rawAnswer),
        })
      );
      await apiClient
        .updateQuestion({
          gameSessionId, 
          id: gameSession.questions[gameSession.currentQuestionIndex].id,
          order: gameSession.questions[gameSession.currentQuestionIndex].order,
          responses: JSON.stringify(finalResultsContainer),
        });
    }
    
    const response = await apiClient.updateGameSession({ id: gameSessionId, ...newUpdates })
    if (response.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
      setHeaderGameCurrentTime(response.phaseOneTime);
    } else if (
      response.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER
    )
    setHeaderGameCurrentTime(response.phaseTwoTime);
    setGameSession(response);
    checkGameTimer(response);
  };

  const checkGameTimer = (gameSession) => {
    if (
      gameSession.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER &&
      gameSession.currentState !== GameSessionState.CHOOSE_TRICKIEST_ANSWER
    ) {
      setGameTimer(false);
    } else {
      setGameTimer(true);
    }
    setGameTimerZero(false);
  };
  const handleStartGame = () => {
    handleUpdateGameSession({ currentQuestionIndex: 0 });
  };

  // TODO: ensure updatequestion occurs after the updateGameSession
  const handleBeginQuestion = () => {
    // I'm keeping this console.log in until we figure out NOT_STARTED so we can tell there's been a change in state
    console.log(gameSession.currentState);
    if (isNullOrUndefined(gameSession))
      return;
    const gameSessionId = gameSession.id;
    const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex];
    const questionId = currentQuestion.id;
    const order = currentQuestion.order;
    

    if (gameSession.currentState !== GameSessionState.TEAMS_JOINING) 
      return;
    apiClient
      .updateQuestion({
        gameSessionId: gameSessionId,
        id: questionId,
        order: order,
        isConfidenceEnabled: isConfidenceEnabled,
        isShortAnswerEnabled: isShortAnswerEnabled
      })
      .then((response) => {
        let newUpdates = {
          currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
        };
        apiClient
          .updateGameSession({ id: gameSessionId, ...newUpdates })
          .then((response) => {
            localStorage.setItem(
              'currentGameTimeStore',
              gameSession.phaseOneTime,
            );
            setHeaderGameCurrentTime(gameSession.phaseOneTime);
            checkGameTimer(response);
            setGameSession(response);
            const teamDataRequests = response.teams.map((team) => {
              return apiClient.getTeam(team.id); // got to call the get the teams from the API so we can see the answers
            });

            Promise.all(teamDataRequests)
              .then((responses) => {
                setTeamsArray(responses);
              })
              .catch((reason) => console.log(reason));
          });
        setIsTimerActive(true);
        setIsLoadModalOpen(true);
      });
  };
  const handleProcessHintsClick = async (hints) => {
    try {
      const questionChoices = getQuestionChoices(gameSession?.questions, gameSession?.currentQuestionIndex);
      const correctChoiceIndex =
        questionChoices.findIndex(({ isAnswer }) => isAnswer) + 1;
      const correctAnswer = questionChoices[correctChoiceIndex].text;
      apiClient.groupHints(hints).then((response) => {
        const parsedHints = JSON.parse(response.gptHints);
        setGptHints(parsedHints);
        if (parsedHints){
          apiClient.getGameSession(gameSessionId).then((gameSession) => {
            apiClient
              .updateQuestion({
                gameSessionId: gameSession.id, 
                id: gameSession.questions[gameSession.currentQuestionIndex].id,
                order: gameSession.questions[gameSession.currentQuestionIndex].order,
                hints: JSON.stringify(parsedHints as IHints[]),
            });
          });
        }
      });
    } catch {
      setHintsError(true);
    }
  };

  if (!gameSession) {
    return null;
  }
  switch (gameSession.currentState) {
    case GameSessionState.NOT_STARTED:
    case GameSessionState.TEAMS_JOINING: {
      return gameSession.currentQuestionIndex === null ? (
        <StartGame
          {...gameSession}
          gameSessionId={gameSession.id}
          isTimerActive={isTimerActive}
          handleStartGame={handleStartGame}
        />
      ) : (
        <GameInProgress
          {...gameSession}
          teamsArray={teamsArray}
          handleUpdateGameSession={handleUpdateGameSession}
          headerGameCurrentTime={headerGameCurrentTime}
          gameTimer={gameTimer}
          gameTimerZero={gameTimerZero}
          isLoadModalOpen={isLoadModalOpen}
          setIsLoadModalOpen={setIsLoadModalOpen}
          showFooterButtonOnly={false}
          isConfidenceEnabled={isConfidenceEnabled}
          handleConfidenceSwitchChange={handleConfidenceSwitchChange}
          isShortAnswerEnabled={isShortAnswerEnabled}
          handleShortAnswerChange={handleShortAnswerChange}
          handleBeginQuestion={handleBeginQuestion}
          navDictionary={navDictionary}
          questionCardRef={questionCardRef}
          responsesRef={responsesRef}
          gameAnswersRef={gameAnswersRef}
          confidenceCardRef={confidenceCardRef}
          featuredMistakesRef={featuredMistakesRef}
          assembleNavDictionary={assembleNavDictionary}
          shortAnswerResponses={shortAnswerResponses}
          handleOnSelectMistake={handleOnSelectMistake}
          hintCardRef={hintCardRef}
          isHintEnabled={isHintEnabled}
          handleHintChange={handleHintChange}
          hints={hints}
          gptHints={gptHints}
          handleProcessHintsClick={handleProcessHintsClick}
          hintsError={hintsError}
        />
      );
    }
    case GameSessionState.CHOOSE_CORRECT_ANSWER:
    case GameSessionState.PHASE_1_DISCUSS:
    case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
    case GameSessionState.PHASE_2_DISCUSS:
      return (
        <GameInProgress
          {...gameSession}
          teamsArray={teamsArray}
          handleUpdateGameSession={handleUpdateGameSession}
          headerGameCurrentTime={headerGameCurrentTime}
          gameTimer={gameTimer}
          gameTimerZero={gameTimerZero}
          isLoadModalOpen={isLoadModalOpen}
          setIsLoadModalOpen={setIsLoadModalOpen}
          showFooterButtonOnly={false}
          isConfidenceEnabled={isConfidenceEnabled}
          isShortAnswerEnabled={isShortAnswerEnabled}
          navDictionary={navDictionary}
          questionCardRef={questionCardRef}
          responsesRef={responsesRef}
          gameAnswersRef={gameAnswersRef}
          confidenceCardRef={confidenceCardRef}
          featuredMistakesRef={featuredMistakesRef}
          assembleNavDictionary={assembleNavDictionary}
          shortAnswerResponses={shortAnswerResponses}
          handleOnSelectMistake={handleOnSelectMistake}
          hintCardRef={hintCardRef}
          isHintEnabled={isHintEnabled}
          handleHintChange={handleHintChange}
          hints={hints}
          gptHints={gptHints}
          handleProcessHintsClick={handleProcessHintsClick}
          hintsError={hintsError}
        />
      );

    case GameSessionState.PHASE_1_RESULTS:
    case GameSessionState.PHASE_2_START:
    case GameSessionState.PHASE_2_RESULTS:
      return (
        <StudentViews
          {...gameSession}
          gameTimer={gameTimer}
          handleUpdateGameSession={handleUpdateGameSession}
          showFooterButtonOnly={true}
          setIsConfidenceEnabled={setIsConfidenceEnabled}
          assembleNavDictionary={assembleNavDictionary}
          isHintEnabled={isHintEnabled}
        />
      );

    case GameSessionState.FINAL_RESULTS:
      return (
        <Ranking
          {...gameSession}
          gameSessionId={gameSession.id}
          handleUpdateGameSession={handleUpdateGameSession}
        />
      );

    default:
      return <Redirect to="/" />;
  }
};

export default GameSessionContainer;
