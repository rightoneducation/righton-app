import { ITeamAnswerContent, ITeamAnswerHint } from '@righton/networking';
/**
 *  string key for storage of game data in users local storage
 */
export const StorageKey = 'rightOn';

export interface LocalModel {
    hasRejoined: boolean;
    currentTimer: number;
}