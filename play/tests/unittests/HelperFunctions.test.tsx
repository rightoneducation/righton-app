import {
  isNameValid,
  isGameCodeValid,
  checkForSubmittedAnswerOnRejoin,
  validateLocalModel,
  teamSorter
} from '../../src/lib/HelperFunctions';
import { randomInt } from 'crypto'
import i18n from './mock/translations/mockTranslations';
import { InputPlaceholder } from '../../src/lib/PlayModels';
import { GameSessionState } from '@righton/networking';
import apiClient from './mock/ApiClient.mock';
import { createTeamMock, createTeamAnswerMock, localModelLoaderMock }  from './mock/MockHelperFunctions';

describe('HelperFunctions', () => {
  it('should only produce an invalid result if the value is empty or matches the placeholder', () => {
    const placeholderFirstName = i18n.t('joingame.playername.firstnamedefault');
    const placeholderLastName = i18n.t('joingame.playername.lastnamedefault');
    // expects empty or placeholder names to be invalid, all else valid
    expect(isNameValid('a')).toBe(true);
    expect(isNameValid('')).toBe(false);
    expect(isNameValid(placeholderFirstName)).toBe(false);
    expect(isNameValid(placeholderLastName)).toBe(false);
  });

  it('it should only produce a valid result if it is a 4 digit numeric', () => {
    // expects 4 digit numerical game code to be valid, all else invalid
    const placeholderGameCode = InputPlaceholder.GAME_CODE;
    expect(isGameCodeValid('1234')).toBe(true);
    expect(isGameCodeValid('')).toBe(false);
    expect(isGameCodeValid('a')).toBe(false);
    expect(isGameCodeValid('123')).toBe(false);
    expect(isGameCodeValid('12345')).toBe(false);
    expect(isGameCodeValid(placeholderGameCode)).toBe(false);
  });

  it('tests that on rejoining in different phases, duplicated behaviour isnt held over', () => {
    const questionId = randomInt(1000, 9999);
    let answerChoices = [
      { id: questionId.toString(), text: '60%', isCorrectAnswer: true, reason: 'reason' },
    ];

    let teamAnswers = [];
    teamAnswers.push(createTeamAnswerMock(questionId, true, false, '60%'));
    teamAnswers.push(createTeamAnswerMock(questionId, false, true, '30%'));

    // expects a rejoined answer that corresponds to the current game answer to return true
    expect(
      checkForSubmittedAnswerOnRejoin(
        true,
        teamAnswers,
        answerChoices,
        GameSessionState.CHOOSE_CORRECT_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: 0, isSubmitted: true });
    // wrong phase
    expect(
      checkForSubmittedAnswerOnRejoin(
        true,
        teamAnswers,
        answerChoices,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: null, isSubmitted: false });
    // already submitted trickiest answer
    answerChoices = [
      { id: questionId.toString(), text: '30%', isCorrectAnswer: false, reason: 'reason' },
    ];
    expect(
      checkForSubmittedAnswerOnRejoin(
        true,
        teamAnswers,
        answerChoices,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: 0, isSubmitted: true });
    // wrong phase
    expect(
      checkForSubmittedAnswerOnRejoin(
        true,
        teamAnswers,
        answerChoices,
        GameSessionState.PHASE_2_DISCUSS
      )
    ).toEqual({ selectedAnswerIndex: null, isSubmitted: false });
    // no answers submitted
    expect(
      checkForSubmittedAnswerOnRejoin(
        true,
        null,
        answerChoices,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: null, isSubmitted: false });
    // no rejoin
    expect(
      checkForSubmittedAnswerOnRejoin(
        false,
        teamAnswers,
        answerChoices,
        GameSessionState.CHOOSE_CORRECT_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: null, isSubmitted: false });
    // no rejoin
    expect(
      checkForSubmittedAnswerOnRejoin(
        false,
        teamAnswers,
        answerChoices,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER
      )
    ).toEqual({ selectedAnswerIndex: null, isSubmitted: false });
  });

  it('tests if a local model is fully populated and no older than 120min', () => {
    const localModel = JSON.stringify(localModelLoaderMock());
    const parsedModel = JSON.parse(localModel);
    // expects fully populated localModel data with time elapsed < 120 minutes, all else is invalid
    expect(validateLocalModel(localModel)).toStrictEqual(parsedModel);
    expect(validateLocalModel('')).toBe(null);
    expect(validateLocalModel(null)).toBe(null);
    // replaces each key with null and expects validation to fail
    Object.keys(parsedModel).forEach((key: any) => {
      const testModel = JSON.parse(JSON.stringify(parsedModel));
      testModel[key] = null;
      expect(validateLocalModel(JSON.stringify(testModel))).toBe(null);
    })
  });

  it('tests that sorting algorithm works (sorted by score first and then alphabetically in the event of a tie)', async () => {
    const mockTeamCompare = ["A Team", "B Team", "C Team", "D Team", "E Team", "F Team"];
    // if no ties, sort team by score only
    let gameSession = await apiClient.createGameSession(1111, false); 
    expect (gameSession).toBeDefined();
    expect (gameSession.teams).toBeDefined();  
    gameSession.teams!.push(createTeamMock(
      gameSession, mockTeamCompare[0], 50),
      createTeamMock(gameSession, mockTeamCompare[1], 0),
      createTeamMock(gameSession, mockTeamCompare[2], 100)
    );
    let sortedTeams = teamSorter(gameSession.teams!, 5);
    expect(sortedTeams).toBeDefined();
    expect(sortedTeams[0].name).toEqual(mockTeamCompare[2]);
    expect(sortedTeams[1].name).toEqual(mockTeamCompare[0]);
    expect(sortedTeams[2].name).toEqual(mockTeamCompare[1]);
    // sort teams by score, then by name if tied
    gameSession = await apiClient.createGameSession(1111, false); 
    expect (gameSession).toBeDefined();
    expect (gameSession.teams).toBeDefined();  
    gameSession.teams!.push(
      createTeamMock(gameSession, mockTeamCompare[0], 0), 
      createTeamMock(gameSession, mockTeamCompare[1], 50), 
      createTeamMock(gameSession, mockTeamCompare[2], 100),
      createTeamMock(gameSession, mockTeamCompare[3], 50),
      createTeamMock(gameSession, mockTeamCompare[4], 50),
      createTeamMock(gameSession, mockTeamCompare[5], 100)
    );
    sortedTeams = teamSorter(gameSession.teams!, 5);
    expect(sortedTeams).toBeDefined();
    expect(sortedTeams[0].name).toEqual(mockTeamCompare[2]);
    expect(sortedTeams[1].name).toEqual(mockTeamCompare[5]);
    expect(sortedTeams[2].name).toEqual(mockTeamCompare[1]);
    expect(sortedTeams[3].name).toEqual(mockTeamCompare[3]);
    expect(sortedTeams[4].name).toEqual(mockTeamCompare[4]);
    expect(sortedTeams[5].name).toEqual(mockTeamCompare[0]);
  });

  // fetchLocalData function is just wrapper for window.localStorage.getItem. validation logic has been broken out for separate testing
});
