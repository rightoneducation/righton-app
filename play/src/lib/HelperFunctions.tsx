import { InputPlaceholder } from './PlayModels';

/**
 * check if name entered isn't empty or the default value
 * @param name - the inputted string for the name
 * @returns - true if the name is valid, false otherwise
 */
export const isNameValid = (name: string) => {
  return (
    name.trim() !== '' && // check for falsy w/o spaces, typ
    name !== InputPlaceholder.FIRST_NAME && // check if default value, typ
    name !== InputPlaceholder.LAST_NAME
  ); 
};

/**
 * check if gameCode is 4 characters, isn't empty and isn't the default value, is numeric
 * @param gameCode - the inputted string for the game code
 * @returns - true if the game code is valid, false otherwise
 */
export const isGameCodeValid = (gameCode: string) => {
  return (
    gameCode.trim() !== '' && 
    gameCode !== InputPlaceholder.GAME_CODE && 
    gameCode.length === 4 &&
    !Number.isNaN(parseInt(gameCode, 10))
  );
};