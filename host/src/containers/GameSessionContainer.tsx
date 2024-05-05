// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import StartGame from '../pages/StartGame';
import StudentViews from '../pages/StudentViews';
import {
  IAPIClients,
  GameSessionState,
  IGameSession,
  IHints,
  isNullOrUndefined,
  ModelHelper,
  TeamParser,
} from '@righton/networking';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GameInProgress from '../pages/GameInProgress';
import Ranking from '../pages/Ranking';
import { buildShortAnswerResponses, getQuestionChoices, getTeamInfoFromAnswerId, rebuildHints } from '../lib/HelperFunctions';

interface GameSessionContainerProps {
  apiClients: IAPIClients;
};

const GameSessionContainer = ({apiClients}: GameSessionContainerProps) => {
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
  const [isHintLoading, setisHintLoading] = React.useState(false);
  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [headerGameCurrentTime, setHeaderGameCurrentTime] = React.useState(
    localStorage.getItem('currentGameTimeStore'),
  );
  const [gameTimer, setGameTimer] = useState(false);
  const [gameTimerZero, setGameTimerZero] = useState(false);
  const [isConfidenceEnabled, setIsConfidenceEnabled] = useState(false);
  const [isShortAnswerEnabled, setIsShortAnswerEnabled] = useState(false);
  const [isHintEnabled, setIsHintEnabled] = useState(true);
  const isSmallScreen = useMediaQuery(() => '(max-width:463px)', {noSsr: true});
  const multipleChoiceText = isSmallScreen ? 'Multiple Choice...' : 'Multiple Choice Answer Explanations';
  // module navigator dictionaries for different game states
  const questionConfigNavDictionary = [
    { ref: questionCardRef, text: 'Question Card' },
    { ref: responsesRef, text: 'Responses Settings' },
    { ref: confidenceCardRef, text: 'Confidence Settings' },
    { ref: hintCardRef, text: 'Player Thinking Settings' },
  ];
  const [navDictionary, setNavDictionary] = useState(
    questionConfigNavDictionary,
  );
  // assembles fields for module navigator in footer
  const assembleNavDictionary = (multipleChoiceText, isShortAnswerEnabled, isConfidenceEnabled, isHintEnabled, state) => {
    if (state === GameSessionState.TEAMS_JOINING) {
      setNavDictionary(questionConfigNavDictionary);
      return;
    }
    const gameplayNavDictionary = [
      { ref: questionCardRef, text: 'Question Card' },
      { ref: responsesRef, text: 'Real-time Responses' },
      { ref: gameAnswersRef, text: 
          isShortAnswerEnabled ? 
           multipleChoiceText
          : `Answer Explanations` },
    ];
    let newDictionary = [...gameplayNavDictionary];
    let insertIndex = 2;
    if (isConfidenceEnabled && (state === GameSessionState.CHOOSE_CORRECT_ANSWER || state === GameSessionState.PHASE_1_DISCUSS)) {
      newDictionary.splice(insertIndex, 0, {
        ref: confidenceCardRef,
        text: 'Player Confidence',
      });
      insertIndex++;
    }
    if (isHintEnabled && (state === GameSessionState.CHOOSE_TRICKIEST_ANSWER || state === GameSessionState.PHASE_2_DISCUSS)) {
      newDictionary.splice(insertIndex, 0, {
        ref: hintCardRef,
        text: 'Player Thinking',
      });
      insertIndex++;
    }
    if (isShortAnswerEnabled) {
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
    try{
    apiClients.gameSession.getGameSession(gameSessionId).then((response) => {
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

        // if the teacher refreshes the page, we need to repopulate the hints/GPT hints depending on the state
        if (gameSession?.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) {
          setHints(rebuildHints(response));
        }
        if (gameSession?.currentState === GameSessionState.PHASE_2_DISCUSS) {
          setGptHints(response.questions[response.currentQuestionIndex].hints);
        }

        setHintsError(false);
        assembleNavDictionary(
          multipleChoiceText,
          response.questions[response.currentQuestionIndex].isShortAnswerEnabled,
          response.questions[response.currentQuestionIndex].isConfidenceEnabled,
          response.questions[response.currentQuestionIndex].isHintEnabled,
          response.currentState,
        );
      }
      // the below sets up the teamsArray - this is necessary as it allows us to view the answers fields (at an inaccessible depth with the gameSessionObject)
      const teamDataRequests = response.teams.map(async (team) => {
        return apiClients.team.getTeam(team.id);
      });
      
      Promise.all(teamDataRequests)
        .then((responses) => {
          // if shortAnswer is enabled we need to rebuild the shortAnswerResponses object on refresh
          if (response.questions[response.currentQuestionIndex].isShortAnswerEnabled === true) {
            responses.forEach((team) => {
              team.teamMembers && team.teamMembers.forEach((teamMember) => {
                teamMember.answers && teamMember.answers.forEach((answer) => {
                  if (answer.questionId === response.questions[response.currentQuestionIndex].id
                    && ((response.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || response.currentState === GameSessionState.PHASE_1_DISCUSS))
                  ) {
                    setShortAnswerResponses((prev) => {
                      return buildShortAnswerResponses(prev, ModelHelper.getCorrectAnswer(response.questions[response.currentQuestionIndex]), response.questions[response.currentQuestionIndex].answerSettings, answer, team.name)
                    });
                  }
                });
              });
            });
          }
          setTeamsArray(responses);
        })
        .catch((reason) => console.error(reason));
    });
   } catch (e) {
      console.error(e);
    }
    let gameSessionSubscription: any | null = null;
    gameSessionSubscription = apiClients.gameSession.subscribeUpdateGameSession(
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
        console.log('updated responses');
        console.log(response.questions[response.currentQuestionIndex].responses);
        setShortAnswerResponses(response.questions[response.currentQuestionIndex].responses);
      },
    );
    // set up subscription for new teams joining
    let createTeamSubscription: any | null = null;
    createTeamSubscription = apiClients.team.subscribeCreateTeam(
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
    deleteTeamSubscription = apiClients.team.subscribeDeleteTeam(
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
    createTeamAnswerSubscription = apiClients.teamAnswer.subscribeCreateTeamAnswer(
      gameSessionId,
      (teamAnswerResponse) => {
        // we have to get the gameSession as we're still in the useEffect closure and the gameSession is stale
        apiClients.gameSession.getGameSession(gameSessionId).then((gameSession) => {
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
            });
            if (gameSession.questions[gameSession.currentQuestionIndex].isShortAnswerEnabled && gameSession.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER) {
              // we are nesting the short answer response in here because we need to use the teamName and teamId to build the shortAnswerResponses object
              // if we did this outside of the setTeamsArray function we would be using stale state values
              setShortAnswerResponses((prevShortAnswerState) => {
                const newShortAnswerState = buildShortAnswerResponses(prevShortAnswerState,  ModelHelper.getCorrectAnswer(gameSession.questions[gameSession.currentQuestionIndex]), gameSession.questions[gameSession.currentQuestionIndex].answerSettings, teamAnswerResponse, teamName, teamId);
                apiClients.question
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
    updateTeamAnswerSubscription = apiClients.teamAnswer.subscribeUpdateTeamAnswer(
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
                    if (answer.id === teamAnswerResponse.id) {
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
          setHints((prevHints) => {
            return [...(prevHints || []), teamAnswerResponse.hint];
          });
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

  const onSelectMistake = (value, isBasedOnPopularity) => {
    setSelectedMistakes((prev) => {
      if (prev.includes(value)) {
        if (isBasedOnPopularity === false)
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
    ) {
      const selectedMistakesSet = new Set(selectedMistakes);
      const finalResultsContainer = shortAnswerResponses.map((answer) => ({
        ...answer,
        isSelectedMistake: answer.normAnswer.some(normAnswer => selectedMistakesSet.has(normAnswer))
      })
      );
      const test = await apiClients.question
        .updateQuestion({
          gameSessionId,
          id: gameSession.questions[gameSession.currentQuestionIndex].id,
          order: gameSession.questions[gameSession.currentQuestionIndex].order,
          responses: JSON.stringify(finalResultsContainer),
        });
      console.log('question update');
      console.log(test);
    }

    // if game is moving to PHASE_2_DISCUSS, hints are enabled, there are hints to process that have yet to be processed
    if (
      gameSession.currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER
      && isHintEnabled
    ) {
      setisHintLoading(true);
      handleProcessHints(hints);
    }

    // reset hints and gptHints to null after discussion. They have already been saved under the question object.
    if (gameSession.currentState === GameSessionState.PHASE_2_DISCUSS
      && isHintEnabled) {
      setGptHints([]);
      setHints([]);
    }

    const response = await apiClients.gameSession.updateGameSession({ id: gameSessionId, ...newUpdates })
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
    if (isNullOrUndefined(gameSession))
      return;
    const gameSessionId = gameSession.id;
    const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex];
    const questionId = currentQuestion.id;
    const order = currentQuestion.order;
    
    if (gameSession.currentState !== GameSessionState.TEAMS_JOINING) 
      return;
    const questionConfigRequests = gameSession.questions.map((question) => {  
      return apiClients.question.updateQuestion({
        gameSessionId: gameSessionId,
        id: question.id,
        order: question.order,
        isConfidenceEnabled: isConfidenceEnabled,
        isShortAnswerEnabled: isShortAnswerEnabled,
        isHintEnabled: isHintEnabled
      })
      .then((response) => {
        let newUpdates = {
          currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
        };
        apiClients.gameSession
          .updateGameSession({ id: gameSessionId, ...newUpdates })
          .then((response) => {
            localStorage.setItem(
              'currentGameTimeStore',
              gameSession.phaseOneTime,
            );
            setHeaderGameCurrentTime(gameSession.phaseOneTime);
            checkGameTimer(response);
            setGameSession(response);
            const teamDataRequests = response.teams.map(async (team) => {
              return apiClients.team.getTeam(team.id);
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
    });
    Promise.all(questionConfigRequests).then((response) => {
      let newUpdates = {
        currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
      };
      apiClients.gameSession
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
            return apiClients.team.getTeam(team.id); // got to call the get the teams from the API so we can see the answers
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
  const handleProcessHints = async (hints) => {
    setHintsError(false);
    try {
      const parsedIncomingHints = hints.map((hint) => {
        return JSON.parse(hint);
      });
      const currentQuestion = gameSession?.questions[gameSession?.currentQuestionIndex];
      const questionText = currentQuestion.text;
      const correctChoiceIndex =
        currentQuestion.choices.findIndex(({ isAnswer }) => isAnswer);
      const correctAnswer = currentQuestion.choices[correctChoiceIndex].text;
      apiClients.gameSession.groupHints(parsedIncomingHints, questionText, correctAnswer).then((response) => {
        const parsedHints = JSON.parse(response.gptHints.content);
        // adds rawHint text to parsedHints received from GPT
        // (we want to minimize the amount of data we send and receive to/from OpenAI
        // so we do this ourselves instead of asking GPT to return data we already have)
        const hintsLookup = new Map(parsedIncomingHints.map(hint => [hint.teamName, hint.rawHint]));
        const combinedHints = parsedHints.map(parsedHint => {
          const updatedTeams = parsedHint.teams.map(team => {
            if (hintsLookup.has(team)) {
              return { name: team, rawHint: hintsLookup.get(team) };
            } else {
              return team;
            }
          });

          return { ...parsedHint, teams: updatedTeams };
        });
        console.log(combinedHints);
        setGptHints(combinedHints);
        setisHintLoading(false);
        if (combinedHints) {
          setHints([]);
          apiClients.gameSession.getGameSession(gameSessionId).then((gameSession) => {
            apiClients.question
              .updateQuestion({
                gameSessionId: gameSession.id,
                id: gameSession.questions[gameSession.currentQuestionIndex].id,
                order: gameSession.questions[gameSession.currentQuestionIndex].order,
                hints: JSON.stringify(combinedHints as IHints[]),
              });
          });
        }
      })
        .catch(e => {
          console.log(e);
          setHintsError(true);
        })
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
          showFooterButtonOnly={gameSession.currentQuestionIndex > 0 ? true : false}
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
          onSelectMistake={onSelectMistake}
          hintCardRef={hintCardRef}
          isHintEnabled={isHintEnabled}
          handleHintChange={handleHintChange}
          hints={hints}
          gptHints={gptHints}
          hintsError={hintsError}
          isHintLoading={isHintLoading}
          handleProcessHints={handleProcessHints}
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
          onSelectMistake={onSelectMistake}
          hintCardRef={hintCardRef}
          isHintEnabled={isHintEnabled}
          handleHintChange={handleHintChange}
          hints={hints}
          gptHints={gptHints}
          hintsError={hintsError}
          isHintLoading={isHintLoading}
          handleProcessHints={handleProcessHints}
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
