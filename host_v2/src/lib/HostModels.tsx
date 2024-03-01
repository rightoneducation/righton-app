/**
 *  string key for storage of game data in users local storage
 */
export const StorageKey = 'rightOn';

export interface LocalModel {
  hasRejoined: boolean;
  currentTimer: number;
}

// used for confidence card
export interface Player {
  answer: string; // answer chosen by this player
  isCorrect: boolean; // true iff the chosen answer is the correct answer
  name: string; // this player's name
}

// used for confidence card
export interface ConfidenceOption {
  confidence: string; // the confidence option (i.e. 'NOT_RATED', 'NOT_AT_ALL', 'KINDA', etc.)
  correct: number; // number of teams who selected this option and answered correctly
  incorrect: number; // number of players who selected tgis option and answered incorrectly
  players: Player[]; // an array of the players that selected this option
}