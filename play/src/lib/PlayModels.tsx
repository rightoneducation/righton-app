import Icon0 from '../img/MonsterIcon0.svg';
import Icon1 from '../img/MonsterIcon1.svg';
import Icon2 from '../img/MonsterIcon2.svg';
import Icon3 from '../img/MonsterIcon3.svg';
import Icon4 from '../img/MonsterIcon4.svg';
import Icon5 from '../img/MonsterIcon5.svg';
import Monster0 from '../img/Monster0.svg';
import Monster1 from '../img/Monster1.svg';
import Monster2 from '../img/Monster2.svg';
import Monster3 from '../img/Monster3.svg';
import Monster4 from '../img/Monster4.svg';
import Monster5 from '../img/Monster5.svg';
import MonsterHandsUp0 from '../img/MonsterHandsUp0.svg';
import MonsterHandsUp1 from '../img/MonsterHandsUp1.svg';
import MonsterHandsUp2 from '../img/MonsterHandsUp2.svg';
import MonsterHandsUp3 from '../img/MonsterHandsUp3.svg';
import MonsterHandsUp4 from '../img/MonsterHandsUp4.svg';
import MonsterHandsUp5 from '../img/MonsterHandsUp5.svg';

/**
 * AnswerState defines each of the cases for an answer that is displayed on an answer select screen
 * @enum AnswersState
 * @param {string} DEFAULT - any answer not correct or selected by player
 * @param {string} CORRECT - correct answer per gameSession object
 * @param {string} PLAYER_SELECTED_CORRECT - player has chosen correct answer
 * @param {string} SELECTED - answer player has selected
 * @param {string} PREVIOUS - answer player has selected in previous phase
 */
export enum AnswerState {
  DEFAULT,
  CORRECT,
  PLAYER_SELECTED_CORRECT,
  SELECTED,
  PREVIOUS,
}

/**
 * OverallGameState handles the state changes between the Pregame or GameInProgress phases
 * Pregame: user-controlled, joining the game
 * GameInProgress: subscription-controlled, playing the game
 * @enum OverallGameState
 */
export enum OverallGameState {
  PREGAME,
  GAME_IN_PROGRESS,
}

/**
 * PregameState handles the substate changes for GameSessionState.JOIN_GAME
 * @enum PregameState
 * @param {string} SPLASH_SCREEN - initial screen for game
 * @param {string} ENTER_GAME_CODE - screen for entering game code
 * @param {string} ENTER_NAME - screen for entering player name
 * @param {string} SELECT_AVATAR - screen for selecting player avatar
 * @param {string} HOW_TO_PLAY - screen for displaying how to play
 */
export enum PregameState {
  SPLASH_SCREEN,
  ENTER_GAME_CODE,
  ENTER_NAME,
  SELECT_AVATAR,
  FINISHED,
}

/**
 * FinalResultsState handles the substate changes for GameSessionState.FINAL_RESULTS
 * @enum PregameState
 * @param {string} CONGRATS - screen for displaying congrats message
 * @param {string} LEADERBOARD - screen for displaying leaderboard
 */
export enum FinalResultsState {
  CONGRATS,
  LEADERBOARD,
}

/**
 * Enum that holds the various states for the lobby, based on the fetching and subscription to the gameSession object
 * @enum LobbyMode
 * @param {string} ERROR - error state
 * @param {string} LOADING - loading state
 * @param {string} READY - waiting for teacher state
 * @param {string} REJOIN - if player is rejoining state
 * @param {string} PREQUESTION - game between questions state
 */
export enum LobbyMode {
  ERROR,
  LOADING,
  READY,
  REJOIN,
  PREQUESTION
}

export enum TimerMode {
  COUNTDOWN,
  JOIN,
}

/**
 * Enum that holds the various states for errors thrown to the ErrorModal.tsx component
 * @enum ErrorType
 * @param {string} CONNECT - error connecting to game session
 * @param {string} ANSWER - error submitting answer
 * @param {string} CONFIDENCE - error selecting confidence
 * @param {string} SCORE - error submitting score
 * @param {string} JOIN - error joining game
 */
export enum ErrorType {
  CONNECT,
  ANSWER,
  CONFIDENCE,
  SCORE,
  JOIN,
}

/**
 * Type interface that holds required info to join a 'basic' game and add team to game sesssion object at start of game
 * @param {number} currentTime: - current time (used to ignore saved local storage after a certain interval)
 * @param {string} gameSessionId - id of game session
 * @param {string} firstName - first name of player
 * @param {string} lastName - last name of player
 * @param {number} selectedAvatar - avatar selected by player
 */
export interface LocalModel {
  currentTime: number;
  gameSessionId: string;
  teamId: string;
  teamMemberId: string;
  selectedAvatar: number;
  hasRejoined: boolean;
  currentTimer: number;
  presubmitAnswer: AnswerObject | null;
}

interface MonsterMap {
  [key: number]: {
    icon: string;
    monster?: string;
    handsup?: string;
    gradient?: string;
  };
}

export const monsterMap: MonsterMap = {
  0: {
    icon: Icon0,
    monster: Monster0,
    handsup: MonsterHandsUp0,
    gradient: 'linear-gradient(90deg, #4DED66 0%, #5ACD3D 100%)',
  },
  1: {
    icon: Icon1,
    monster: Monster1,
    handsup: MonsterHandsUp1,
    gradient: 'linear-gradient(90deg, #FED52B 0%, #C64E0F 100%)',
  },
  2: {
    icon: Icon2,
    monster: Monster2,
    handsup: MonsterHandsUp2,
    gradient: 'linear-gradient(90deg, #0A4178 0%, #0F56A1 100%)',
  },
  3: {
    icon: Icon3,
    monster: Monster3,
    handsup: MonsterHandsUp3,
    gradient: 'linear-gradient(90deg, #7E00C4 0%, #9139F8 100%)',
  },
  4: {
    icon: Icon4,
    monster: Monster4,
    handsup: MonsterHandsUp4,
    gradient: 'linear-gradient(90deg, #69000B 0%, #8B000A 100%)',
  },
  5: {
    icon: Icon5,
    monster: Monster5,
    handsup: MonsterHandsUp5,
    gradient: 'linear-gradient(90deg, #036496 0%, #1F81B3 100%)',
  },
};

export enum InputPlaceholder {
  GAME_CODE = '####',
}

/**
 *  string key for storage of game data in users local storage
 */
export const StorageKey = 'rightOn';

export enum AnswerType {
  MULTICHOICE,
  TEXT,
  FORMULA,
  NULL
}

export interface AnswerObject {
  answerTexts: string[];
  answerTypes: AnswerType[];
  multiChoiceAnswerIndex?: number | null;
  isSubmitted: boolean;
}