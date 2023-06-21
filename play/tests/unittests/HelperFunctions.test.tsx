import {
  isNameValid,
  isGameCodeValid,
  checkForSubmittedAnswerOnRejoin,
  validateLocalModel
} from '../../src/lib/HelperFunctions';
import i18n from '../mockTranslations';
import { InputPlaceholder } from '../../src/lib/PlayModels';
import { GameSessionState } from '@righton/networking';
import teamAnswers from './mock/teamAnswers.json'
import localModel from './mock/localModel.json'


describe('HelperFunctions', () => {
  it ('isNameValid', () => {
    const placeholderFirstName = i18n.t('joingame.playername.firstnamedefault');
    const placeholderLastName = i18n.t('joingame.playername.lastnamedefault');
    // expects empty or placeholder names to be invalid, all else valid
    expect(isNameValid('a')).toBe(true);
    expect(isNameValid('')).toBe(false);
    expect(isNameValid(placeholderFirstName)).toBe(false);
    expect(isNameValid(placeholderLastName)).toBe(false);
  });

  it ('isGameCodeValid', () => {
    // expects 4 digit numerical game code to be valid, all else invalid
    const placeholderGameCode = InputPlaceholder.GAME_CODE;
    expect(isGameCodeValid('1234')).toBe(true);
    expect(isGameCodeValid('')).toBe(false);
    expect(isGameCodeValid('a')).toBe(false);
    expect(isGameCodeValid('123')).toBe(false);
    expect(isGameCodeValid('12345')).toBe(false);
    expect(isGameCodeValid(placeholderGameCode)).toBe(false);
  });

  it ('checkForSubmittedAnswerOnRejoin', () => {
    let answerChoices = [{id: '4790', text: '60%', isCorrectAnswer: true, reason: 'reason'}];
    // expects a rejoined answer that corresponds to the current game answer to return true 
    expect(checkForSubmittedAnswerOnRejoin(true, teamAnswers, answerChoices, GameSessionState.CHOOSE_CORRECT_ANSWER)).toEqual({selectedAnswerIndex: 0, isSubmitted: true});
    // wrong phase
    expect(checkForSubmittedAnswerOnRejoin(true, teamAnswers, answerChoices, GameSessionState.CHOOSE_TRICKIEST_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});    
    // already submitted trickiest answer
    answerChoices = [{id: '4790', text: '30%', isCorrectAnswer: false, reason: 'reason'}];
    expect(checkForSubmittedAnswerOnRejoin(true, teamAnswers, answerChoices, GameSessionState.CHOOSE_TRICKIEST_ANSWER)).toEqual({selectedAnswerIndex: 0, isSubmitted: true});    
    // wrong phase
    expect(checkForSubmittedAnswerOnRejoin(true, teamAnswers, answerChoices, GameSessionState.PHASE_2_DISCUSS)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
    // no answers submitted
    expect(checkForSubmittedAnswerOnRejoin(true, null, answerChoices, GameSessionState.CHOOSE_TRICKIEST_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
    // no rejoin
    expect(checkForSubmittedAnswerOnRejoin(false, teamAnswers, answerChoices, GameSessionState.CHOOSE_CORRECT_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
    // no rejoin
    expect(checkForSubmittedAnswerOnRejoin(false, teamAnswers, answerChoices, GameSessionState.CHOOSE_TRICKIEST_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
  });

  // fetchLocalData function is just wrapper for window.localStorage.getItem. validation logic has been broken out so it can be tested below

  it ('validateLocalModel', () => {
    //expect(validateLocalModel('')).toBe(false);
    expect(validateLocalModel(null)).toBe(null);
    console.log(JSON.parse('{"gameSessionId":"e51eb1e7-7141-4bfe-ab4e-0cd02670b32c","teamId":"3d796b32-7dab-4585-90ab-ef21df4a1814","teamMemberId":"15ac7afc-0884-40b0-8d05-aa79602a28d8","selectedAvatar":2,"hasRejoined":false}'));
   expect(validateLocalModel(`{"gameSessionId":"e51eb1e7-7141-4bfe-ab4e-0cd02670b32c","teamId":"3d796b32-7dab-4585-90ab-ef21df4a1814","teamMemberId":"15ac7afc-0884-40b0-8d05-aa79602a28d8","selectedAvatar":2,"hasRejoined":false}`)).toStrictEqual(localModel);
  });
});

