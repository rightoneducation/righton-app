export const version: string = '0.3.0'; 
export const date: string = '02/12/2024';
export const model: string = 'gpt-4o';
export const prevVersions: string[] = ['0.1.0', '0.1.1', '0.1.2', '0.2.0', '0.2.2', '0.2.3', '0.2.4', '0.2.5', '0.2.6'];  // add older versions here for Eval to display

export enum ExplanationRegenType {
  ACCEPT = 0,
  ACCEPT_EDITED = 1,
  DISCARD = 2,
  REGEN = 3
}