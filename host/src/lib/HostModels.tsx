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
}

export interface HostAnswerObject {
  rawInput: string,
  normalizedInput: string,
  inputType: InputType
}

export interface SortedAnswerObject extends HostAnswerObject {
  count: number
}

export enum InputType {
  TEXT,
  NUMBER,
  FORMULA,
}