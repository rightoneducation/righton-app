import { parse } from 'mathjs';
import { removeStopwords, eng } from 'stopword';
import { ConfidenceLevel, GameSessionState } from '../AWSMobileApi';
import { isNullOrUndefined } from '../IApiClient';

export enum AnswerType {
  NUMBER = 0,
  STRING = 1,
  EXPRESSION = 2
}

export enum AnswerPrecision {
  WHOLE = 0,
  TENTH = 1,
  HUNDREDTH = 2,
  THOUSANDTH = 3,
}

// interface for answer prior to submission by player
// this is stored in local storage on the player's device
export interface IPreSubmitAnswer {
  rawAnswer: string,
  answerType: AnswerType;
  answerPrecision: AnswerPrecision,
  currentState: GameSessionState,
  currentQuestionIndex: number,
  isShortAnswerEnabled: boolean,
  isSubmitted: boolean,
}

// attributes that are specific to player-submitted hints
export interface ITeamAnswerHint {
  rawHint: string;
  teamName: string;
  isHintSubmitted: boolean;
}

// attributes that are specific to a numeric answer
export interface INumericAnswerAttributes {
  answerPrecision: AnswerPrecision;
}

// attributes that are specific to a multiple choice answer
export interface IMultiChoiceAnswerAttributes {
  multiChoiceAnswerIndex: number;
}

// attrivutes that are required during the gameplay phase 
// in contrast to when a teacher is creating the queation
export interface IGamePlayAttributes {
  questionId?: number;
  isChosen?: boolean;
  teamMemberAnswersId?: string;
  text?: string;
  isTrickAnswer?: boolean;
  confidenceLevel?: ConfidenceLevel;
  hint?: ITeamAnswerHint;
  percent?: number;
  isSubmitted?: boolean;
  isShortAnswerEnabled?: boolean;
  currentState?: GameSessionState | null;
  currentQuestionIndex?: number | null;
}

export interface IBaseAnswerConfig<T> {
  id?: string;
  rawAnswer: string;
  normAnswer?: (string | number)[] | null;
  answerType: AnswerType;
  numericAnswerAttributes?: INumericAnswerAttributes;
  multiChoiceAnswerAttributes?: IMultiChoiceAnswerAttributes;
  gamePlayAttributes?: IGamePlayAttributes;
  createdAt?: string;
  updatedAt?: string;
  value: T;
}

export abstract class BaseAnswer<T> {
  id?: string;
  rawAnswer: string;
  normAnswer?: (string | number)[] | null;
  answerType: AnswerType;
  numericAnswerAttributes?: INumericAnswerAttributes;
  multiChoiceAnswerAttributes?: IMultiChoiceAnswerAttributes;
  gamePlayAttributes?: IGamePlayAttributes;
  value: T;
  constructor(config: IBaseAnswerConfig<T>) 
  {
    this.id = config.id,
    this.rawAnswer = config.rawAnswer,
    this.normAnswer = config.normAnswer,
    this.answerType = config.answerType,
    this.numericAnswerAttributes = config.numericAnswerAttributes,
    this.multiChoiceAnswerAttributes = config.multiChoiceAnswerAttributes,
    this.gamePlayAttributes = config.gamePlayAttributes,
    this.value = config.value
  }

  abstract isEqualTo(otherAnswers: T[]): Boolean;
}

function normalizeAnswers(currentItem: string, answerType: AnswerType) {
  const normAnswers = [];
  if (!isNullOrUndefined(currentItem)) {
    switch (answerType) {
      case AnswerType.NUMBER:
        // if it's a number, check for percentages and convert to decimal
        const percentagesRegex = /(\d+(\.\d+)?)%/g;
        const extractPercents = currentItem.match(percentagesRegex);
        const percentages = extractPercents ? parseFloat(extractPercents[0]) / 100 : null
        if (!isNullOrUndefined(percentages)){
          normAnswers.push(percentages);
        }
        // then remove commas and spaces and push
        const noCommas = currentItem.replace(/,/g, '');
        const normItem = noCommas.trim();
        if (!isNullOrUndefined(normItem)) {
          normAnswers.push(normItem);
        }
        break;
      case AnswerType.STRING:
        // if it's a string, pull out any numbers and remove spaces, and remove stopwords
        const normArray = currentItem.toLowerCase().replace(/[\d\r\n]+/g, '').trim().split(' ');
        const normNoStopwords = removeStopwords(normArray, eng).join(' ');
        if (!isNullOrUndefined(normNoStopwords)) {
          normAnswers.push(normNoStopwords);
        }
        break;
      case AnswerType.EXPRESSION:
        // if it's an expression, use parse and toString to extract expression trees and compare
        // anything more complex than this will require a custom parser (and is probably not worth it)
        // https://mathjs.org/docs/expressions/parsing.html
        const normItemExp = parse(currentItem.toString()).toString();
        if (!isNullOrUndefined(normItemExp)) {
          normAnswers.push(normItemExp);
        }
        break;
    }
  }
  return normAnswers;
};

export class NumberAnswer extends BaseAnswer<number> {
  constructor(config: IBaseAnswerConfig<number>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const normalizedAnswers = normalizeAnswers(this.rawAnswer, AnswerType.NUMBER);
    
    this.normAnswer = normalizedAnswers;
    this.answerType = AnswerType.NUMBER;
    return this;
  }

  isEqualTo(otherAnswers: number[]): Boolean {
    const answerPrecisionDictionary = {
      [AnswerPrecision.WHOLE]: 0,
      [AnswerPrecision.TENTH]: 1,
      [AnswerPrecision.HUNDREDTH]: 2,
      [AnswerPrecision.THOUSANDTH]: 3
    }
    if (this.normAnswer){
      return this.normAnswer.some((answer) => {
        if (otherAnswers.includes(answer as number)){
          if (this.numericAnswerAttributes && this.numericAnswerAttributes.answerPrecision)
          {
            // we clean up the raw answer again to remove commas and the percent sign
            // we need to use the raw answer because the norm answer could be changed if there is a percentage present
            // so it's not a reliable way to check decimal places
            const normRawAnswer = this.rawAnswer.replace(/[,%]/g, '').trim();
            const precisionEnum = this.numericAnswerAttributes.answerPrecision as AnswerPrecision;

            // this is going to round the number we found that matches to the precision that the teacher requested
            const roundedNumberAsString = Number(normRawAnswer).toFixed(answerPrecisionDictionary[precisionEnum]);
            return normRawAnswer === roundedNumberAsString;
          }
        }
        return false;
      }) 
    }
    return false;
  }

  static isAnswerTypeValid(input: string): Boolean {
    const numericAnswerRegex = /^-?[0-9]*(\.[0-9]*)?%?$/; // matches any number, with or without a decimal, with or without a percent sign
    return numericAnswerRegex.test(input);
  }

  static isAnswerPrecisionValid(input: string, precision: AnswerPrecision): Boolean {
    const roundedNumberAsString = Number(input).toFixed(precision);
    return input.toString() === roundedNumberAsString;
  }
}

export class StringAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const normalizedAnswers = normalizeAnswers(this.rawAnswer, AnswerType.STRING);

    this.normAnswer = normalizedAnswers;
    this.answerType = AnswerType.STRING;
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    const otherAnswersSet = new Set(otherAnswers);
    if (this.normAnswer && this.normAnswer.some((answer) => otherAnswersSet.has(answer as string))) {
      return true;
    }
    return false;
  }

  // checks if string value is actually a number
  static isAnswerTypeValid(input: string): Boolean {
    const numericAnswerRegex = /^-?[0-9]*(\.[0-9]*)?%?$/; // matches any number, with or without a decimal, with or without a percent sign
    return !numericAnswerRegex.test(input);
  }
}

export class ExpressionAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const normalizedAnswers = normalizeAnswers(this.rawAnswer, AnswerType.EXPRESSION);

    this.normAnswer = normalizedAnswers;
    this.answerType = AnswerType.EXPRESSION;
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    if (this.normAnswer) {
      for (let i =0; i < this.normAnswer.length; i++) {
        for (let y = 0; y < otherAnswers.length; y++) {
          try {
            const exp1 = parse(this.normAnswer[i].toString()).toString();
            const exp2 = parse(otherAnswers[y].toString()).toString();
            if (exp1 === exp2)
              return true;
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
   return false;
  }

   // checks if expression can be parsed via mathjs
   static isAnswerTypeValid(input: string): Boolean {
    try {
      parse(input);
      return true;
    } catch {
      return false;
    }
  }
}