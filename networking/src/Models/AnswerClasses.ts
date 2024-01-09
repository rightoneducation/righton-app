import { parse } from 'mathjs';
import { removeStopwords, eng } from 'stopword';
import { ConfidenceLevel, GameSessionState } from '../AWSMobileApi';
import { isNullOrUndefined } from '../IApiClient';

export enum AnswerType {
  NUMBER = 0,
  STRING = 1,
  EXPRESSION = 2
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

export interface IAnswerContent {
  rawAnswer: string; 
  normAnswer?: (NormAnswerType)[] | null;
  answerType: AnswerType;
  answerPrecision?: string;
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted?: boolean;
  isShortAnswerEnabled?: boolean;
  currentState?: GameSessionState | null;
  currentQuestionIndex?: number | null;
}

export interface ITeamAnswerAttributes {
  questionId?: number;
  isChosen?: boolean;
  teamMemberAnswersId?: string;
  text?: string;
  answerContent?: IAnswerContent;
  isTrickAnswer?: boolean;
  confidenceLevel?: ConfidenceLevel;
  hint?: ITeamAnswerHint;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBaseAnswerConfig<T> {
  id?: string;
  answerContent: IAnswerContent;
  teamAnswerAttributes?: ITeamAnswerAttributes;
  value: T;
}

export abstract class BaseAnswer<T> {
  id?: string;
  answerContent: IAnswerContent;
  teamAnswerAttributes?: ITeamAnswerAttributes;
  value: T;
  constructor(config: IBaseAnswerConfig<T>) 
  {
    this.id = config.id,
    this.answerContent = config.answerContent,
    this.teamAnswerAttributes = config.teamAnswerAttributes,
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
    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.NUMBER);
    
    this.answerContent = {
      ...this.answerContent,
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
    if (this.answerContent.normAnswer){
      return this.answerContent.normAnswer.some((answer) => {
        if (otherAnswers.includes(answer as number)){
          if (this.answerContent && this.answerContent.answerPrecision)
          {
            // we clean up the raw answer again to remove commas and the percent sign
            // we need to use the raw answer because the norm answer could be changed if there is a percentage present
            // so it's not a reliable way to check decimal places
            const normRawAnswer = this.answerContent.rawAnswer.replace(/[,%]/g, '').trim();
            const precisionEnum = AnswerPrecision[this.answerContent.answerPrecision as keyof typeof AnswerPrecision];

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
    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.STRING);

    this.answerContent = {
      ...this.answerContent,
      normAnswer: normalizedAnswers,
      answerType: AnswerType.STRING
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    const otherAnswersSet = new Set(otherAnswers);
    if (this.answerContent.normAnswer && this.answerContent.normAnswer.some((answer) => otherAnswersSet.has(answer as string))) {
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
    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.EXPRESSION);

    this.answerContent = {
      ...this.answerContent,
      normAnswer: normalizedAnswers,
      answerType: AnswerType.EXPRESSION
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    if (this.answerContent.normAnswer) {
      for (let i =0; i < this.answerContent.normAnswer.length; i++) {
        for (let y = 0; y < otherAnswers.length; y++) {
          try {
            const exp1 = parse(this.answerContent.normAnswer[i].toString()).toString();
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