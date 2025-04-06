export const version: string = '1.0.0'; 
export const date: string = '03/28/2025';
export const model: string = 'gpt-4o';
export const prevVersions: string[] = ['0.1.0', '0.1.1', '0.1.2', '0.2.0', '0.2.2', '0.2.3', '0.2.4', '0.2.5', '0.2.6', '0.3.0'];  // add older versions here for Eval to display

export enum ExplanationRegenType {
  ACCEPT = 0,
  ACCEPT_EDITED = 1,
  DISCARD = 2,
  REGEN = 3
}

export const localStorageKey = 'righton_saved_explanations';