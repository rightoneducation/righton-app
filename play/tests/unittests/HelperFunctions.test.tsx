import {
  isNameValid,
  isGameCodeValid,
  checkForSubmittedAnswerOnRejoin,
  fetchLocalData
} from '../../src/lib/HelperFunctions';
import i18n from '../mockTranslations';
import { InputPlaceholder } from '../../src/lib/PlayModels';
import { GameSessionState } from '@righton/networking';
import teamAnswers from './mock/teamAnswers.json'


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
    expect(checkForSubmittedAnswerOnRejoin(true, teamAnswers, answerChoices, GameSessionState.CHOOSE_CORRECT_ANSWER)).toEqual({selectedAnswerIndex: 0, isSubmitted: true});
    expect(checkForSubmittedAnswerOnRejoin(false, teamAnswers, answerChoices, GameSessionState.CHOOSE_CORRECT_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
    expect(checkForSubmittedAnswerOnRejoin(false, teamAnswers, answerChoices, GameSessionState.CHOOSE_TRICKIEST_ANSWER)).toEqual({selectedAnswerIndex: null, isSubmitted: false});
  });

  it ('fetchLocalData', () => {});
   
});

