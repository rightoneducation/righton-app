import { Button, TextField } from "@mui/material";
import {
  APIClients,
  Environment,
  GameSessionState,
  IGameSession,
  ITeam,
  BackendAnswer,
  MultiChoiceAnswer,
  ITeamMember,
} from "@righton/networking";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [gameSession, setGameSession] = useState<IGameSession | null>();
  const [prevGameSessionId, setPrevGameSessionId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<number>(0);
  const [gameSessionId, setGameSessionId] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [team, setTeam] = useState<ITeam | null>();
  const [teamMember, setTeamMember] = useState<ITeamMember | null>();
  const [teamAnswer, setTeamAnswer] = useState<BackendAnswer | null>();

  const apiClients = new APIClients(Environment.Developing);

  const gameSessionSubscription = useRef<any | null>(null);

  useEffect(() => {
    // @ts-ignore
    return () => gameSessionSubscription.current?.unsubscribe();
  }, []);

  const updateGameSession = (gameSession: IGameSession | null) => {
    setGameSession(gameSession);
    if (isNullOrUndefined(gameSession)) {
      console.debug("No game session");
      gameSessionSubscription.current?.unsubscribe();
      return;
    }

    if (prevGameSessionId === gameSession.id) {
      return;
    }

    setPrevGameSessionId(gameSession.id);

    gameSessionSubscription.current?.unsubscribe();
    gameSessionSubscription.current = apiClients.gameSession.subscribeUpdateGameSession(
      gameSession.id,
      (gameSession) => {
        console.log(gameSession);
      }
    );
  };

  const handleUpdateGameSessionState = (gameSessionState: GameSessionState) => {
    if (gameSession == null) {
      return;
    }

    let gameSessionId = gameSession.id;

    apiClients.gameSession
      .updateGameSession({ id: gameSessionId, currentState: gameSessionState })
      .then((response) => {
        updateGameSession(response);
        setError(null);
      })
      .catch((error) => {
        console.error(error.message);
        setError(error.message);
        updateGameSession(null);
      });
  };

  return (
    <div>
      <span>
        {!isNullOrUndefined(gameSession)
          ? `Updated game session state to ${gameSession.currentState} for ${gameSession.id} and ${gameSession.gameCode}`
          : ""}
      </span>
      <Button
        variant="contained"
        onClick={() => {
          apiClients.gameSession
            .createGameSession(1262, false)
            .then((gameSession) => {
              updateGameSession(gameSession);
              apiClients.gameSession.updateGameSession({
                id: gameSession.id,
                currentQuestionIndex: 0,
              });
              setError(null);
            })
            .catch((error) => {
              console.error(error.message);
              updateGameSession(null);
            });
        }}
      >
        Create game session
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.NOT_STARTED);
        }}
      >
        Not Started
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.TEAMS_JOINING);
        }}
      >
        Teams Joining
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.CHOOSE_CORRECT_ANSWER);
        }}
      >
        Choose Correct
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_1_DISCUSS);
        }}
      >
        Phase 1 Discuss
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_1_RESULTS);
        }}
      >
        Phase 1 Results
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_START);
        }}
      >
        Phase 2 Start
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(
            GameSessionState.CHOOSE_TRICKIEST_ANSWER
          );
        }}
      >
        Choose Trickiest Answer
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_DISCUSS);
        }}
      >
        Phase 2 Discuss
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.PHASE_2_RESULTS);
        }}
      >
        Phase 2 Results
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.FINAL_RESULTS);
        }}
      >
        Rankings
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleUpdateGameSessionState(GameSessionState.FINISHED);
        }}
      >
        Finished
      </Button>
      <TextField
        value={gameCode}
        variant="standard"
        placeholder="Game code"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        onChange={(e) => setGameCode(Number(e.target.value))}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          apiClients.gameSession
            .getGameSessionByCode(gameCode)
            .then((response) => {
              if (response == null) {
                setError(`No game found for ${gameCode}`);
                updateGameSession(null);
                return;
              }
              console.log(response);
              updateGameSession(response);
              setError(null);
            })
            .catch((error) => {
              console.error(error.message);
              setError(error.message);
              updateGameSession(null);
            });
        }}
      >
        Get Game Session by Code
      </Button>
      <TextField
        value={gameSessionId}
        variant="standard"
        placeholder="gameSessionId"
        onChange={(e) => setGameSessionId(e.target.value)}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          apiClients.gameSession
            .getGameSession(gameSessionId)
            .then((response) => {
              if (response == null) {
                setError(`No game found for ${gameSessionId}`);
                updateGameSession(null);

                return;
              }
              console.log(response);
              updateGameSession(response);
              setError(null);
            })
            .catch((error) => {
              console.error(error.message);
              setError(error.message);
              updateGameSession(null);
            });
        }}
      >
        Get Game Session by ID
      </Button>
      <TextField
        value={teamName}
        variant="standard"
        placeholder="Team name"
        onChange={(e) => setTeamName(e.target.value)}
      />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (isNullOrUndefined(gameSession)) {
            return;
          }
          apiClients.team
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
              if (team == null) {
                setError(`Failed to create team`);
                return;
              }
              console.log(team);
              setTeam(team);
              setError(null);
            })
            .catch((error) => {
              console.error(error.message);
              setError(error.message);
              setTeam(null);
            });
        }}
      >
        Add team
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (isNullOrUndefined(team)) {
            return;
          }
          apiClients.teamMember
            .addTeamMemberToTeam(team.id, false, "some-device-id")
            .then((teamMember) => {
              if (teamMember == null) {
                setError(`Failed to create team member`);
                return;
              }
              console.log(teamMember);
              setError(null);
              setTeamMember(teamMember);
            })
            .catch((error) => {
              console.error(error.message);
              setError(error.message);
              setTeamMember(null);
            });
        }}
      >
        Add team member
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          if (
            isNullOrUndefined(gameSession) ||
            isNullOrUndefined(gameSession.questions) ||
            isNullOrUndefined(team) ||
            isNullOrUndefined(teamMember)
          ) {
            return;
          }
          const question = gameSession.questions[0];
          if (isNullOrUndefined(question)) {
            return null;
          }
          if (
            isNullOrUndefined(question.choices) ||
            question.choices.length == 0
          ) {
            return null;
          }
          const choice =
            question.choices[
              Math.floor(Math.random() * question.choices.length)
            ];
          if (isNullOrUndefined(choice)) {
            return;
          }
          const newAnswer = new MultiChoiceAnswer(choice.text, 3);
          const answerInput = {
            id: uuidv4(),
            answer: newAnswer,
            isSubmitted: true,
            isShortAnswerEnabled: false,
            currentState: gameSession.currentState,
            currentQuestionIndex: gameSession.currentQuestionIndex,
            teamMemberAnswersId: teamMember.id,
            questionId: question.id,
            text: choice.text,
            confidenceLevel: "NOT_RATED",
            hint: {rawHint: ""},
          } as BackendAnswer;
          apiClients.teamAnswer
            .addTeamAnswer(
              answerInput
            )
            .then((teamAnswer) => {
              if (teamAnswer == null) {
                setError(`Failed to create answer`);
                return;
              }
              console.log(teamAnswer);
              setError(null);
              setTeamAnswer(teamAnswer);
            })
            .catch((error) => {
              console.error(error.message);
              setError(error.message);
              setTeamAnswer(null);
            });
        }}
      >
        Add team answer (basic)
      </Button>
    </div>
  );
}

function isNullOrUndefined<T>(
  value: T | null | undefined
): value is null | undefined {
  return value === null || value === undefined;
}

export default App;
