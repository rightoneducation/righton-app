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

  it ('validateLocalModel', () => {
    const localModelString = '{"currentTime":28123113.553616665,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":false,"currentTimer":297}';
    // expects fully populated localModel data with time elapsed < 120 minutes, all else is invalid
    expect(validateLocalModel(localModelString)).toStrictEqual(localModel);
    expect(validateLocalModel('')).toBe(null);
    expect(validateLocalModel(null)).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":false,"currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":false,"currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":false,"currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"","selectedAvatar":5,"hasRejoined":false,"currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":"","hasRejoined":false,"currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":"","currentTimer":297}')).toBe(null);
    expect(validateLocalModel('{"currentTime":1,"gameSessionId":"91d31b3f-f14c-4dd8-ae8b-a3e17164d31f","teamId":"e06c22a2-928f-4d6c-b511-252bcc34de6a","teamMemberId":"0ed40697-0635-43a5-b46a-29ef5fb56d5d","selectedAvatar":5,"hasRejoined":false,"currentTimer":""}')).toBe(null);
  });

  // fetchLocalData function is just wrapper for window.localStorage.getItem. validation logic has been broken out so it can be tested below
});

