import { parse } from 'mathjs';
import { removeStopwords, eng } from 'stopword';
import { ConfidenceLevel, GameSessionState } from '../AWSMobileApi';
import { isNullOrUndefined } from '../IApiClient';

export enum AnswerType {
  NUMBER = 0,
  STRING = 1,
  EXPRESSION = 2,
  MULTICHOICE = 3
}

export type NormAnswerType = string | number;

export enum AnswerPrecision {
  WHOLE = 0,
  TENTH = 1,
  HUNDREDTH = 2,
  THOUSANDTH = 3,
}

export interface ITeamAnswerHint {
  rawHint: string;
  teamName: string;
  isHintSubmitted: boolean;
}

export interface ILocalAnswer {
  rawAnswer: string;
  normAnswer?: (NormAnswerType)[] | null;
  answerType: AnswerType;
  answerPrecision?: string;
  isSubmitted?: boolean;
  isShortAnswerEnabled?: boolean;
  currentState?: GameSessionState | null;
  currentQuestionIndex?: number | null;
}

export interface IBaseAnswerConfig<T> {
  id?: string;
  answer: ILocalAnswer;
  value: T;
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

export class LocalAnswer {
  answer: {
    rawAnswer: string;
    normAnswer?: (NormAnswerType)[] | null;
    answerType: AnswerType;
    answerPrecision?: string;
  }
  isSubmitted?: boolean;
  isShortAnswerEnabled?: boolean;
  currentState?: GameSessionState | null;
  currentQuestionIndex?: number | null;

  constructor(config: ILocalAnswer) {
    const { rawAnswer, answerType, answerPrecision, normAnswer } = config;
    const { isSubmitted, isShortAnswerEnabled, currentState, currentQuestionIndex } = config;

    this.answer = { rawAnswer, normAnswer, answerType, answerPrecision };
    this.isSubmitted = isSubmitted;
    this.isShortAnswerEnabled = isShortAnswerEnabled;
    this.currentState = currentState;
    this.currentQuestionIndex = currentQuestionIndex;
  }
}

export abstract class BaseAnswer<T> {
  id?: string;
  answer: ILocalAnswer;
  questionId?: number;
  teamMemberAnswersId?: string;
  text?: string;
  hint?: ITeamAnswerHint;
  confidenceLevel?: ConfidenceLevel;
  value: T;

  constructor(config: IBaseAnswerConfig<T>) {
    const { id, answer, value } = config;
    this.id = id;
    this.answer = answer;
    this.value = value;
  }

  abstract isEqualTo(otherAnswers: T[]): Boolean;
}

export class NumberAnswer extends BaseAnswer<number> {
  constructor(config: IBaseAnswerConfig<number>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const normalizedAnswers = normalizeAnswers(this.answer.rawAnswer, AnswerType.NUMBER);
    
    this.answer = {
      ...this.answer,
      normAnswer: normalizedAnswers,
      answerType: AnswerType.NUMBER
    };
    return this;
  }

  isEqualTo(otherAnswers: number[]): Boolean {
    const answerPrecisionDictionary = {
      [AnswerPrecision.WHOLE]: 0,
      [AnswerPrecision.TENTH]: 1,
      [AnswerPrecision.HUNDREDTH]: 2,
      [AnswerPrecision.THOUSANDTH]: 3
    }
    if (this.answer.normAnswer){
      return this.answer.normAnswer.some((answer) => {
        if (otherAnswers.includes(answer as number)){
          if (this.answer && this.answer.answerPrecision)
          {
            // we clean up the raw answer again to remove commas and the percent sign
            // we need to use the raw answer because the norm answer could be changed if there is a percentage present
            // so it's not a reliable way to check decimal places
            const normRawAnswer = this.answer.rawAnswer.replace(/[,%]/g, '').trim();
            const precisionEnum = AnswerPrecision[this.answer.answerPrecision as keyof typeof AnswerPrecision];

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
    const normalizedAnswers = normalizeAnswers(this.answer.rawAnswer, AnswerType.STRING);

    this.answer = {
      ...this.answer,
      normAnswer: normalizedAnswers,
      answerType: AnswerType.STRING
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    const otherAnswersSet = new Set(otherAnswers);
    if (this.answer.normAnswer && this.answer.normAnswer.some((answer) => otherAnswersSet.has(answer as string))) {
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
    const normalizedAnswers = normalizeAnswers(this.answer.rawAnswer, AnswerType.EXPRESSION);

    this.answer = {
      ...this.answer,
      normAnswer: normalizedAnswers,
      answerType: AnswerType.EXPRESSION
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    if (this.answer.normAnswer) {
      for (let i =0; i < this.answer.normAnswer.length; i++) {
        for (let y = 0; y < otherAnswers.length; y++) {
          try {
            const exp1 = parse(this.answer.normAnswer[i].toString()).toString();
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

export class MultiChoiceAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the TeamAnswer constructor

    this.answer = {
      ...this.answer,
      answerType: AnswerType.MULTICHOICE
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    return otherAnswers.includes(this.answer.rawAnswer);
  }
}