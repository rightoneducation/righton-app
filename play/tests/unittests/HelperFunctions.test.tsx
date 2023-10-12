import { GameSessionState } from '@righton/networking';
import { randomInt } from 'crypto';
import {
  isNameValid,
  isGameCodeValid,
  checkForSubmittedAnswerOnRejoin,
  validateLocalModel,
  teamSorter,
} from '../../src/lib/HelperFunctions';
import i18n from '../../src/i18n.mock';
import { InputPlaceholder } from '../../src/lib/PlayModels';
import apiClient from './mock/ApiClient.mock';
import {
  createTeamMock,
  createTeamAnswerMock,
  localModelLoaderMock,
} from './mock/MockHelperFunctions';

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
    let localAnswer = {
      answers: [
        {
          rawText: '',
          normText: [''],
          type: 0,
        },
      ],
      multiChoiceAnswerIndex: 0,
      isSubmitted: true,
      currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
      currentQuestionIndex: 0,
    };
    let localModel = {
      currentTime: 0,
      currentQuestionIndex: 0,
      teamId: '1232123',
      teamMemberId: '123123',
      selectedAvatar: 0,
      hasRejoined: true,
      currentTimer: 0,
      gameSessionId: '12121',
      answer: localAnswer
    };
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
    };
    
    (global as any).localStorage = localStorageMock;
    (global.localStorage as jest.Mocked<typeof localStorage>).setItem = jest.fn();
    const teamAnswers = [];
    teamAnswers.push(createTeamAnswerMock(questionId, true, false, '60%'));
    teamAnswers.push(createTeamAnswerMock(questionId, false, true, '30%'));

    // expects a rejoined answer that corresponds to the current game answer to return true
    expect(
      checkForSubmittedAnswerOnRejoin(
        {...localModel, answer: localAnswer},
        true,
        GameSessionState.CHOOSE_CORRECT_ANSWER,
        0
      )
    ).toEqual({
      answers: [{
        rawText: '',
        normText: [''],
        type: 0,
      }],
      isSubmitted: true, 
      multiChoiceAnswerIndex: 0, 
      currentState: GameSessionState.CHOOSE_CORRECT_ANSWER, 
      currentQuestionIndex: 0
    });
    // wrong phase
    expect(
      checkForSubmittedAnswerOnRejoin(
        {...localModel, answer: localAnswer},
        true,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER,
        0
      )
    ).toEqual({ 
      answers: [{
        rawText: '',
        normText: [''],
        type: 1,
      }], 
      isSubmitted: false, 
      multiChoiceAnswerIndex: null, 
      currentState: null, 
      currentQuestionIndex: null 
    });
    // wrong question
    expect(
      checkForSubmittedAnswerOnRejoin(
        {...localModel, answer: localAnswer},
        true,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER,
        1
      )
    ).toEqual({
      answers: [{
        rawText: '',
        normText: [''],
        type: 1,
      }],
      isSubmitted: false, 
      multiChoiceAnswerIndex: null, 
      currentState: null, 
      currentQuestionIndex: null
    });
    // already submitted trickiest answer
    localAnswer = 
      {
        answers: [{
          rawText: '',
          normText: [''],
          type: 0,
        }],
        isSubmitted: true,
        multiChoiceAnswerIndex: 0,
        currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
        currentQuestionIndex: 0
      };
    expect(
      checkForSubmittedAnswerOnRejoin(
        {...localModel, answer: localAnswer},
        true,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER,
        0
      )
    ).toEqual({
      answers: [{
        rawText: '',
        normText: [''],
        type: 0,
      }],
      isSubmitted: true, 
      multiChoiceAnswerIndex: 0, 
      currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER, 
      currentQuestionIndex: 0 
    });
    // wrong phase
    expect(
      checkForSubmittedAnswerOnRejoin(
        localModel,
        true,
        GameSessionState.PHASE_2_DISCUSS,
        0
      )
    ).toEqual({
      answers: [{
        rawText: '',
        normText: [''],
        type: 1,
      }],
      isSubmitted: false, 
      multiChoiceAnswerIndex: null, 
      currentState: null, 
      currentQuestionIndex: null 
    });
    // no answers submitted
    localAnswer = 
    {
      answers: [{
        rawText: '',
        normText: [''],
        type: 0,
      }],
      isSubmitted: false,
      multiChoiceAnswerIndex: 0, // should be null
      currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
      currentQuestionIndex: 0
    };
    expect(
      checkForSubmittedAnswerOnRejoin(
        localModel,
        true,
        GameSessionState.CHOOSE_TRICKIEST_ANSWER,
        0
      )
    ).toEqual({ 
      answers: [{
        rawText: '',
        normText: [''],
        type: 1,
      }],
      isSubmitted: false, 
      multiChoiceAnswerIndex: null, 
      currentState: null,
      currentQuestionIndex: null 
    });
    // no rejoin
    expect(
      checkForSubmittedAnswerOnRejoin(
        localModel,
        false,
        GameSessionState.CHOOSE_CORRECT_ANSWER,
        0
      )
    ).toEqual({ 
      answers: [{
        rawText: '',
        normText: [''],
        type: 1,
      }],
      isSubmitted: false, 
      multiChoiceAnswerIndex: null, 
      currentState: null, 
      currentQuestionIndex: null 
    });
  });

  it('tests if a local model is fully populated and no older than 120min', () => {
    const localModel = JSON.stringify(localModelLoaderMock());
    const localModelAnswer = JSON.stringify(
      {
        answers: [{
          rawText: '',
          normText: [''],
          type: 0,
        }],
        isSubmitted: false,
        multiChoiceAnswerIndex: 0, // should be null
        currentState: null,
        currentQuestionIndex: 0
      }
    )
    const parsedModel = JSON.parse(localModel);
    const parsedAnswer = JSON.parse(localModelAnswer);
    parsedModel.localAnswer = parsedAnswer;
    // expects fully populated localModel data with time elapsed < 120 minutes, all else is invalid
    expect(validateLocalModel(localModel, localModelAnswer)).toStrictEqual(parsedModel);
    expect(validateLocalModel('', localModelAnswer)).toBe(null);
    expect(validateLocalModel(null, localModelAnswer)).toBe(null);
    // replaces each key with null and expects validation to fail
    Object.keys(parsedModel).forEach((key: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const testModel = JSON.parse(JSON.stringify(parsedModel));
      testModel[key] = null;
      const testModelAnswer = JSON.parse(JSON.stringify(parsedAnswer));
      parsedModel[key] = null;
      expect(validateLocalModel(JSON.stringify(testModel), testModelAnswer)).toBe(null);
    });
  });

  it('tests that sorting algorithm works (sorted by score first and then alphabetically in the event of a tie)', async () => {
    const mockTeamCompare = [
      'A Team',
      'B Team',
      'C Team',
      'D Team',
      'E Team',
      'F Team',
    ];
    // if no ties, sort team by score only
    let gameSession = await apiClient.createGameSession(1111, false);
    expect(gameSession).toBeDefined();
    expect(gameSession.teams).toBeDefined();
    gameSession.teams!.push(
      createTeamMock(gameSession, mockTeamCompare[0], 50),
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
    expect(gameSession).toBeDefined();
    expect(gameSession.teams).toBeDefined();
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
