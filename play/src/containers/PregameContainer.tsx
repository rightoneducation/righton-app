import React, { useState, useEffect, useTransition, useRef } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import {
  IAPIClients,
  APIClients,
  isNullOrUndefined,
  IGameSession,
  GameSessionState,
  EduDataAPIClient,
  IEduDataAPIClient
} from '@righton/networking';
import SplashScreen from '../pages/pregame/SplashScreen';
import JoinGame from '../pages/pregame/JoinGame';
import {
  PregameState,
  LocalModel,
  StorageKey,
  StorageKeyEduDataStudentId,
} from '../lib/PlayModels';
import { isGameCodeValid, fetchLocalData } from '../lib/HelperFunctions';
import { identifyStudent, trackEvent, trackError, PlayEvent } from '../lib/analytics';

interface PregameFinished {
  apiClients: IAPIClients;
}

// Outcome of entering a game code. Kept as a discriminated union so that exactly
// one side effect runs per entry — recover and join can never both fire.
type EntryDecision =
  | { kind: 'recover'; model: LocalModel }
  | { kind: 'join' }
  | { kind: 'reject_state' };

// A student "owns" a live team when localStorage holds a team that still exists
// in THIS game session. Identity is the teamId — never the display name.
const ownsLiveTeam = (
  gs: IGameSession,
  stored: LocalModel | null
): stored is LocalModel =>
  !!stored &&
  stored.gameSessionId === gs.id &&
  gs.teams.some((team) => team.id === stored.teamId);

// Single source of truth for what to do when a code is entered (pure/testable).
const classifyEntry = (
  gs: IGameSession,
  stored: LocalModel | null
): EntryDecision => {
  if (ownsLiveTeam(gs, stored)) {
    return { kind: 'recover', model: stored };
  }
  if (gs.currentState !== GameSessionState.TEAMS_JOINING) {
    return { kind: 'reject_state' };
  }
  return { kind: 'join' };
};

export function PregameContainer({ 
  apiClients
 }: PregameFinished) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedDevice = useMediaQuery(theme.breakpoints.down('md'));
  const [isShowCodeError, setIsShowCodeError] = useState<boolean>(false);
  const [isShowNameError, setIsShowNameError] = useState<boolean>(false);
  const [isShowNameInvalidError, setIsShowNameInvalidError] = useState<boolean>(false);
  const [shouldShowAvatarSelect, setShouldShowAvatarSelect] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [pregameState, setPregameState] = useState<PregameState>(
    PregameState.SPLASH_SCREEN
  );
  // retreive local storage data so that player can choose to rejoin game
  const [rejoinGameObject, setRejoinGameObject] = useState<LocalModel | null>(
    useLoaderData() as LocalModel
  );
  // state variables used to collect player information in pregame phase
  // information is loaded into local storage on select avatar screen and passed to /game
  const [gameSession, setGameSession] = useState<IGameSession | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(
    Math.floor(Math.random() * 6)
  );
  // Layer 3: guards against rapid double-submits (observed rage-tapping on Join)
  const isSubmittingRef = useRef(false);

  // Reattach to an existing team (by teamId) and navigate into the game. Takes the
  // model as a param so it works from BOTH the rejoin modal and teamId-based
  // recovery (where the React snapshot may be stale or null after a decline).
  const rejoinWithModel = (model: LocalModel) => {
    const storageObject: LocalModel = {
      ...model,
      hasRejoined: true,
    };
    identifyStudent(model.teamId, {
      gameSessionId: model.gameSessionId,
      avatarIndex: model.selectedAvatar,
    });
    trackEvent(PlayEvent.GAME_REJOIN_STARTED, {
      gameSessionId: model.gameSessionId,
      teamId: model.teamId,
    });
    window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
    startTransition(() => {
      navigate(`/game`);
    });
  };

  // if player has opted to rejoin old game session through modal on SplashScreen
  const handleRejoinSession = () => {
    if (!rejoinGameObject) return;
    rejoinWithModel(rejoinGameObject);
  };

  // If the player declines the rejoin modal we only dismiss it (the modal owns its
  // own isModalVisible state). We intentionally do NOT delete StorageKey: keeping the
  // teamId lets us recover the student if they fall into the fresh-join flow and
  // collide with their own team. The 2h TTL, overwrite-on-join, and final-results
  // cleanup still purge stale data.
  const handleDontRejoinSession = () => {
    setRejoinGameObject(null);
  };

  // create team and teammember on backend
  const addTeamToGame = async (inputGameSession: IGameSession) => {
    const teamName = `${firstName} ${lastName}`;
    // Genuine duplicate name: a *different* student already took it (self-collisions
    // are intercepted upstream by classifyEntry / the recovery guard, so reaching
    // here means we do NOT own a live team in this game). First-come-first-serve —
    // surface the name error and stop. Returning cleanly avoids a spurious api_error.
    if (inputGameSession.teams.some((team) => team.name === teamName)) {
      // isShowCodeError opens the error Collapse; isShowNameError selects the
      // "name taken" message variant inside it (see JoinGame.tsx). Both required.
      setIsShowCodeError(true);
      setIsShowNameError(true);
      trackEvent(PlayEvent.GAME_JOIN_FAILURE, { reason: 'duplicate_name', gameSessionId: inputGameSession.id });
      return undefined;
    }
    try {
      const team = await apiClients.team.addTeamToGameSessionId(
        inputGameSession.id,
        teamName,
        null,
        selectedAvatar
      );
      if (!team) {
        setIsShowCodeError(true);
        trackEvent(PlayEvent.GAME_JOIN_FAILURE, { reason: 'api_error', gameSessionId: inputGameSession.id });
        return undefined;
      }
      const teamMember = await apiClients.teamMember.addTeamMemberToTeam(
        team.id,
        true,
        uuidv4()
      );
      if (!teamMember) {
        setIsShowCodeError(true);
        trackEvent(PlayEvent.GAME_JOIN_FAILURE, { reason: 'api_error', gameSessionId: inputGameSession.id });
        return undefined;
      }
      return { teamId: team.id, teamMemberAnswersId: teamMember.id };
    } catch (error) {
      setIsShowCodeError(true);
      trackError(PlayEvent.GAME_JOIN_FAILURE, error, { reason: 'api_error', gameSessionId: inputGameSession.id });
      return undefined;
    }
  };

  // on click of avatar select button: create team + team member, persist, navigate.
  const handleAvatarSelectClick = async (gameSessionResponse: IGameSession) => {
    // Layer 2 (defense-in-depth): if we already own a live team in this game, never
    // create a second one — recover into the existing team instead. This backstops
    // classifyEntry in case the create flow is ever reached directly.
    const stored = fetchLocalData();
    if (ownsLiveTeam(gameSessionResponse, stored)) {
      trackEvent(PlayEvent.GAME_REJOIN_RECOVERED, {
        gameSessionId: gameSessionResponse.id,
        teamId: stored.teamId,
      });
      rejoinWithModel(stored);
      return;
    }

    const teamInfo = await addTeamToGame(gameSessionResponse);
    if (!teamInfo) {
      // addTeamToGame already surfaced the correct error flag (name vs api/code).
      // Throw so JoinGame's catch scrolls the error into view (UI signal only —
      // this does not re-enter addTeamToGame, so no duplicate telemetry).
      throw new Error('join_failed');
    }
    // EDUDATA - initialize once we have an identifier for the student/team joining.
    // Persist the studentId so rejoin/refresh reuses the same UpGrade identity
    // (avoids splitting a single student across two assignments).
    try {
      await apiClients.initEduData(teamInfo.teamId);
      window.localStorage.setItem(StorageKeyEduDataStudentId, teamInfo.teamId);
    } catch (e) {
      console.error('UpGrade failed to init, continuing');
      console.error('Error Output:');
      console.error(e);
    }

    identifyStudent(teamInfo.teamId, {
      gameSessionId: gameSessionResponse.id,
      avatarIndex: selectedAvatar,
    });
    trackEvent(PlayEvent.GAME_JOIN_SUCCESS, {
      gameSessionId: gameSessionResponse.id,
      teamId: teamInfo.teamId,
      avatarIndex: selectedAvatar,
    });
    const storageObject: LocalModel = {
      currentTime: new Date().getTime() / 60000,
      gameSessionId: gameSessionResponse.id,
      teamMemberAnswersId: teamInfo.teamMemberAnswersId,
      teamId: teamInfo.teamId,
      teamName: `${firstName} ${lastName}`,
      selectedAvatar,
      hasRejoined: false,
      currentTimer: gameSessionResponse.phaseOneTime,
      answer: null,
    };
    window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
    navigate(`/game`);
  };

  // on click of game code button, check if game code is valid
  // if game code is invalid, return false to display error
  // if game code is valid, store gameSessionId for future subscription and advance to ENTER_NAME state
  const handleGameCodeClick = async (
    inputGameCodeValue: string
  ): Promise<boolean> => {
    if (!isGameCodeValid(inputGameCodeValue)) {
      return false;
    }
    // Layer 3: in-flight latch — ignore rapid re-submits so we can't run two
    // joins/recoveries concurrently (observed rage-tapping on Join).
    if (isSubmittingRef.current) {
      return false;
    }
    isSubmittingRef.current = true;
    try {
      const gameSessionResponse = await apiClients.gameSession.getGameSessionByCode(
        parseInt(inputGameCodeValue, 10)
      );
      if (isNullOrUndefined(gameSessionResponse)) {
        setIsShowCodeError(true);
        return false;
      }
      // Layer 1: one decision, one action. classifyEntry is pure; exactly one branch
      // below performs a side effect, so recover and join can never both fire.
      const decision = classifyEntry(gameSessionResponse, fetchLocalData());
      switch (decision.kind) {
        case 'recover':
          trackEvent(PlayEvent.GAME_REJOIN_RECOVERED, {
            gameSessionId: gameSessionResponse.id,
            teamId: decision.model.teamId,
          });
          rejoinWithModel(decision.model);
          return true;
        case 'reject_state':
          // Game already in progress and this student has no team here.
          return false;
        case 'join':
        default:
          setGameSession(gameSessionResponse);
          await handleAvatarSelectClick(gameSessionResponse);
          return true;
      }
    } catch (error) {
      throw new Error(`Failed to add team to game: ${error}`);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  
  switch (pregameState) {
    case PregameState.ENTER_GAME_CODE:
      return (
        <JoinGame
          isSmallDevice={isSmallDevice}
          isMedDevice={isMedDevice}
          isShowCodeError={isShowCodeError}
          setIsShowCodeError={setIsShowCodeError}
          isShowNameError={isShowNameError}
          setIsShowNameError={setIsShowNameError}
          isShowNameInvalidError={isShowNameInvalidError}
          setIsShowNameInvalidError={setIsShowNameInvalidError}
          shouldShowAvatarSelect={shouldShowAvatarSelect}
          setShouldShowAvatarSelect={setShouldShowAvatarSelect}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          handleGameCodeClick={handleGameCodeClick}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          isButtonDisabled={isButtonDisabled}
          setIsButtonDisabled={setIsButtonDisabled}
        />
      );
    case PregameState.SPLASH_SCREEN:
    default:
      return (
        <SplashScreen
          rejoinGameObject={rejoinGameObject}
          setPregameState={setPregameState}
          handleRejoinSession={handleRejoinSession}
          handleDontRejoinSession={handleDontRejoinSession}
        />
      );
  }
}

export function PregameLocalModelLoader(): LocalModel | null {
  return fetchLocalData();
}
