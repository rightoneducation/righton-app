import { parse } from 'mathjs';
import { removeStopwords, eng } from 'stopword';
import { ConfidenceLevel, GameSessionState } from '../AWSMobileApi';
import { isNullOrUndefined } from '../global';
import {v4 as uuidv4} from 'uuid';

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

export type Answer = NumericAnswer | StringAnswer | ExpressionAnswer | MultiChoiceAnswer

export interface IAnswerHint {
  rawHint: string;
  teamName: string;
  isHintSubmitted: boolean;
}

export abstract class BaseAnswer<T> {
  rawAnswer: string
  answerType: AnswerType

  constructor (rawAnswer: string, answerType: AnswerType){
      this.rawAnswer = rawAnswer;
      this.answerType = answerType;
  }

  abstract normalizeAnswer(rawAnswer: string): void;

  abstract isEqualTo(otherNormAnswers: T[]): Boolean;
}

export class StringAnswer extends BaseAnswer<string>{
  normAnswer: NormAnswerType[]
  constructor (rawAnswer: string, answerType: AnswerType, normAnswer?: string[]){
      super(rawAnswer, answerType)
      this.normAnswer = normAnswer ?? []
  }

  normalizeStringAnswer(rawAnswer: string): NormAnswerType[] {
    const normAnswers: NormAnswerType[] = [];
     // if it's a string, remove spaces and stopwords
     const normArray = rawAnswer.toLowerCase().replace(/[\r\n]+/g, '').trim().split(' ');
     const normNoStopwords = removeStopwords(normArray, eng).join(' ');
     if (!isNullOrUndefined(normNoStopwords)) {
       normAnswers.push(normNoStopwords);
     }
     return normAnswers;
  }

  normalizeAnswer(rawAnswer: string): void {
    this.normAnswer = this.normalizeStringAnswer(rawAnswer);
  }

  isEqualTo(otherNormAnswers: string[]): Boolean {
    if (this.normAnswer) {
      return this.normAnswer.some((answer) => {
        return otherNormAnswers.includes(answer as string);
      }) 
    }
    return true;
  }

}

export class NumericAnswer extends BaseAnswer<Number>{
  normAnswer: NormAnswerType[]
  answerPrecision: AnswerPrecision

  constructor (rawAnswer: string, answerType: AnswerType, answerPrecision: AnswerPrecision, normAnswer?: number[],){
      super(rawAnswer, answerType)
      this.normAnswer = normAnswer ?? []
      this.answerPrecision = answerPrecision
  }

  normalizeNumericAnswer(rawAnswer: string): NormAnswerType[] {
    const normAnswers: NormAnswerType[] = [];
    const percentagesRegex = /(\d+(\.\d+)?)%/g;
    const extractPercents = rawAnswer.match(percentagesRegex);
    const percentages = extractPercents ? parseFloat(extractPercents[0]) / 100 : null
    if (!isNullOrUndefined(percentages) && !isNaN(percentages)){
      normAnswers.push(percentages);
      return normAnswers;
    }
    // then remove commas and spaces and push
    const noCommas = rawAnswer.replace(/,/g, '');
    const normItem = noCommas.trim();
    if (!isNullOrUndefined(normItem)) {
      normAnswers.push(Number(normItem));
    }
    return normAnswers;
  }
  
  normalizeAnswer(rawAnswer: string): void {
    this.normAnswer = this.normalizeNumericAnswer(rawAnswer);
  }

  isEqualTo(otherNormAnswers: number[]): Boolean {
    const answerPrecisionDictionary = {
      [AnswerPrecision.WHOLE]: 0,
      [AnswerPrecision.TENTH]: 1,
      [AnswerPrecision.HUNDREDTH]: 2,
      [AnswerPrecision.THOUSANDTH]: 3
    }
    if (this.normAnswer){
      return this.normAnswer.some((answer) => {
        if (otherNormAnswers.includes(answer as number)){
          if (!isNullOrUndefined(this.answerPrecision))
          {
            // we clean up the raw answer again to remove commas and the percent sign
            // we need to use the raw answer because the norm answer could be changed if there is a percentage present
            // so it's not a reliable way to check decimal places
            const normRawAnswer = this.rawAnswer.replace(/[,%]/g, '').trim();

            // this is going to round the number we found that matches to the precision that the teacher requested
            const roundedNumberAsString = Number(normRawAnswer).toFixed(answerPrecisionDictionary[this.answerPrecision]);
            if (normRawAnswer === roundedNumberAsString)
              return true;
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

export class ExpressionAnswer extends BaseAnswer<string>{
  normAnswer: NormAnswerType[]

  constructor (rawAnswer: string, answerType: AnswerType, normAnswer?: string[]){
    super(rawAnswer, answerType)
    this.normAnswer = normAnswer ?? []
  }
  
  normalizeExpressionAnswer(rawAnswer: string): NormAnswerType[] {
    const normAnswers: NormAnswerType[] = [];
    //convert / / notation to abs for use with math.js absolute value
    const parseForAbs = rawAnswer.replace(/\/([^\/]+)\//g, 'abs($1)');
    // if it's an expression, use parse and toString to extract expression trees and compare
    // anything more complex than this will require a custom parser (and is probably not worth it)
    // https://mathjs.org/docs/expressions/parsing.html
    let normItemExp;
    try {
      normItemExp = parse(parseForAbs).toString();
    } catch (e) {
      console.error(e);
      normItemExp = parseForAbs.toLowerCase().replace(/\s/g,'');
    }
    if (!isNullOrUndefined(normItemExp)) {
      normAnswers.push(normItemExp);
    }
    return normAnswers;
  }

  normalizeAnswer(rawAnswer: string): void {
    this.normAnswer = this.normalizeExpressionAnswer(rawAnswer);
  }

  isEqualTo(otherNormAnswers: string[]): Boolean {
    if (this.normAnswer) {
      for (let i =0; i < this.normAnswer.length; i++) {
        for (let y = 0; y < otherNormAnswers.length; y++) {
          if (this.normAnswer[i].toString().toLowerCase().replace(/\s/g,'') === otherNormAnswers[y].toString().toLowerCase().replace(/\s/g,''))
            return true;
          try {
            const exp1 = parse(this.normAnswer[i].toString()).toString();
            const exp2 = parse(otherNormAnswers[y].toString()).toString();
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
  normAnswer: NormAnswerType[]

  constructor (rawAnswer: string, answerType: AnswerType, normAnswer?: string[]){
    super(rawAnswer, answerType)
    this.normAnswer = normAnswer ?? []
  }

  normalizeMultiChoiceAnswer(rawAnswer: string): NormAnswerType[] {
    const normAnswers: NormAnswerType[] = [];
    normAnswers.push(rawAnswer.trim());
    return normAnswers;
  }

  normalizeAnswer(rawAnswer: string): void {
    this.normAnswer = this.normalizeMultiChoiceAnswer(rawAnswer);
  }

  isEqualTo(otherNormAnswers: string[]): Boolean {
    return otherNormAnswers.includes(this.rawAnswer);
  }
}

export class BackendAnswer {
  id: string;
  answer: Answer;
  isSubmitted: boolean;
  isShortAnswerEnabled: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  questionId: string;
  teamMemberAnswersId: string;
  teamAnswersId: string;
  teamName: string;
  text: string; // temporary to maintain build compatibility
  confidenceLevel?: ConfidenceLevel | null;
  hint?: IAnswerHint | null;

  constructor (
    answer: Answer, 
    isSubmitted: boolean, 
    isShortAnswerEnabled: boolean, 
    currentState: GameSessionState, 
    currentQuestionIndex: number,
    questionId: string,
    teamMemberAnswersId: string,
    teamAnswerId: string,
    teamName: string,
    text: string,
    id?: string | null,
    confidenceLevel?: ConfidenceLevel | null,
    hint?: IAnswerHint | null
  ){
    this.answer = answer;
    this.isSubmitted = isSubmitted;
    this.isShortAnswerEnabled = isShortAnswerEnabled;
    this.currentState = currentState;
    this.currentQuestionIndex = currentQuestionIndex;
    this.questionId = questionId;
    this.teamMemberAnswersId = teamMemberAnswersId;
    this.teamAnswersId = teamAnswerId;
    this.teamName = teamName;
    this.text = text;
    this.id = id ?? uuidv4();
    this.confidenceLevel = confidenceLevel;
    this.hint = hint;
  }

  static toFlattenedJSONString(backendAnswer: BackendAnswer): string {
    try{
      const { answer, ...rest } = backendAnswer;
      const jsonObject = { ...answer, ...rest };
      return JSON.stringify(jsonObject);
    } catch (e) {
      throw new Error('Invalid answer object');
    }
  }

  static fromFlattenedJSONString(json: string): BackendAnswer {
    try{
      const flatBackendAnswer = JSON.parse(json);
      const { rawAnswer, answerType, answerPrecision, ...rest } = flatBackendAnswer;
      const answer = AnswerFactory.createAnswer(rawAnswer, answerType, answerPrecision);
      const backendAnswer = new BackendAnswer(
        answer,
        rest.isSubmitted,
        rest.isShortAnswerEnabled,
        rest.currentState,
        rest.currentQuestionIndex,
        rest.questionId,
        rest.teamMemberAnswersId,
        rest.id,
        rest.confidenceLevel,
        rest.hint);
      return backendAnswer;
    } catch (e) {
      throw new Error('Invalid JSON string');
    }
  }
}

export class AnswerFactory {
  static createAnswer(rawAnswer: string, answerType: AnswerType, answerPrecision?: AnswerPrecision): Answer {
    switch (answerType) {
      case AnswerType.NUMBER:
        return new NumericAnswer(rawAnswer, answerType, answerPrecision || AnswerPrecision.WHOLE);
      case AnswerType.EXPRESSION:
        return new ExpressionAnswer(rawAnswer, answerType);
      case AnswerType.MULTICHOICE:
        return new MultiChoiceAnswer(rawAnswer, answerType);
      case AnswerType.STRING:
      default:
        return new StringAnswer(rawAnswer, answerType);
    }
  }
}
