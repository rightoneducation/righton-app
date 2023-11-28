import { parse } from 'mathjs';
import { removeStopwords, eng } from 'stopword';
import { ConfidenceLevel, GameSessionState } from '../AWSMobileApi';
import { isNullOrUndefined } from '../IApiClient';

export enum AnswerType {
  NUMBER = 'number',
  STRING = 'string',
  EXPRESSION = 'expression'
}

export interface ITeamAnswerContent {
  delta?: string;
  rawAnswer?: string; 
  normAnswer?: (string | number)[] | null;
  answerType?: AnswerType;
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted?: boolean;
  isShortAnswerEnabled: boolean;
  currentState: GameSessionState | null;
  currentQuestionIndex: number | null;
}

export interface ICorrectAnswerContent {
  rawAnswer: string;
  normAnswer?: string[];
  answerType: AnswerType;
}

export interface IBaseAnswerConfig<T> {
  id?: string;
  answerContent: ITeamAnswerContent | ICorrectAnswerContent;
  value: T;
}

export interface ITeamAnswerConfig<T> {
  id?: string;
  questionId: number;
  isChosen: boolean;
  teamMemberAnswersId: string;
  text: string;
  answerContent: ITeamAnswerContent;
  isTrickAnswer: boolean;
  confidenceLevel: ConfidenceLevel;
  createdAt?: string;
  updatedAt?: string;
  value: T;
}

abstract class BaseAnswer<T> {
  id?: string;
  answerContent: ITeamAnswerContent | ICorrectAnswerContent;
  value: T;
  constructor(config: IBaseAnswerConfig<T>) 
  {
    this.id = config.id,
    this.answerContent = config.answerContent,
    this.value = config.value
  }
}

abstract class TeamAnswer<T> extends BaseAnswer<T> {
  id?: string;
  questionId: number;
  teamMemberAnswersId: string;
  isChosen: boolean;
  isTrickAnswer: boolean;
  text: string;
  answerContent: ITeamAnswerContent;
  confidenceLevel: ConfidenceLevel;
  createdAt?: string;
  updatedAt?: string;
  value: T;
  constructor(config: ITeamAnswerConfig<T>) 
    {
      super(config);
      this.id = config.id,
      this.questionId = config.questionId,
      this.teamMemberAnswersId = config.teamMemberAnswersId,
      this.isChosen = config.isChosen,
      this.text = config.text,
      this.answerContent = config.answerContent,
      this.isTrickAnswer = config.isTrickAnswer,
      this.confidenceLevel = config.confidenceLevel,
      this.createdAt = config.createdAt,
      this.updatedAt = config.updatedAt,
      this.value = config.value
  }

  abstract isEqualTo(otherAnswers: T[]): Boolean;
}

function isNumeric (num: any){ // eslint-disable-line @typescript-eslint/no-explicit-any
  return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && 
    !isNaN(num as number); // eslint-disable-line no-restricted-globals
}

function normalizeAnswers(currentItem: any, answerType: AnswerType) {
  const rawAnswers = [];
  const normAnswers = [];
  switch (answerType) {
    case AnswerType.NUMBER:
      if (!currentItem?.formula) {
        // if it's a number, check for percentages and convert to decimal
        const percentagesRegex = /(\d+(\.\d+)?)%/g;
        const extractPercents = currentItem.match(percentagesRegex);
        const percentages = extractPercents ? parseFloat(extractPercents[0]) / 100 : null
        if (!isNullOrUndefined(percentages) && !isNullOrUndefined(percentages)){
          rawAnswers.push(extractPercents[0]); 
          normAnswers.push(percentages);
          break;
        }
        // then remove commas and spaces and push
        const noCommas = currentItem.replace(/,/g, '');
        const normItem = Number(noCommas.trim());
        if (!isNullOrUndefined(currentItem) && !isNullOrUndefined(normItem)) {
          rawAnswers.push(normItem);
          normAnswers.push(normItem);
        }
      }
      break;
    case AnswerType.STRING:
      if (!currentItem?.formula && !isNumeric(currentItem)) {
        // if it's a string, pull out any numbers and remove spaces, and remove stopwords
        const normArray = currentItem.toLowerCase().replace(/[\d\r\n]+/g, '').trim().split(' ');
        const normNoStopwords = removeStopwords(normArray, eng).join(' ');
        if (!isNullOrUndefined(currentItem) && !isNullOrUndefined(normNoStopwords)) {
          rawAnswers.push(normNoStopwords);
          normAnswers.push(normNoStopwords);
        }
      }
      break;
    case AnswerType.EXPRESSION:
      if (currentItem?.formula) {
        // if it's a formula, remove spaces
        const normItem = currentItem.formula.replace(/(\r\n|\n|\r|\s|" ")/gm, '').trim();
        if (!isNullOrUndefined(currentItem) && !isNullOrUndefined(normItem)) {
          rawAnswers.push(normItem);
          normAnswers.push(normItem);
        }
      }
      break;
  }
  const joinedRawAnswers = rawAnswers.join(' ');
  return { rawAnswers: joinedRawAnswers, normAnswers};
};

function extractFromDelta(currentContents: any) {
 return currentContents.ops.map((item: any) => {
    if (!isNullOrUndefined(item.insert)) {
      if (!isNullOrUndefined(item.insert.formula)) {
        return item.insert.formula;
      } else {
        return item.insert;
      }
    }
  }).join(' ');
}

export class CorrectNumberAnswer extends BaseAnswer<number> {
  constructor(config: IBaseAnswerConfig<number>) {
    super(config); // Pass the config to the BaseAnswer constructor

    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.NUMBER);

    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
      answerType: AnswerType.NUMBER
    };
    return this;
  }
}

export class CorrectStringAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the BaseAnswer constructor

    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.STRING);

    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
      answerType: AnswerType.STRING
    };
    return this;
  }
}

export class CorrectExpressionAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the BaseAnswer constructor

    const normalizedAnswers = normalizeAnswers(this.answerContent.rawAnswer, AnswerType.EXPRESSION);

    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
      answerType: AnswerType.EXPRESSION
    };
    return this;
  }
}

export class NumberAnswer extends TeamAnswer<number> {
  constructor(config: ITeamAnswerConfig<number>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const extractedAnswers = this.answerContent.isShortAnswerEnabled ? extractFromDelta(this.answerContent.delta) : this.answerContent.rawAnswer;
    const normalizedAnswers = normalizeAnswers(extractedAnswers, AnswerType.NUMBER);
    
    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
      answerType: AnswerType.NUMBER
    };
    return this;
  }

  isEqualTo(otherAnswers: number[]): Boolean {
    if (this.answerContent.normAnswer && this.answerContent.normAnswer.some((answer) => otherAnswers.includes(answer as number))) {
      return true;
    }
    return false;
  }
}

export class StringAnswer extends TeamAnswer<string> {
  constructor(config: ITeamAnswerConfig<string>) {
    super(config); // Pass the config to the TeamAnswer constructor
    const extractedAnswers = this.answerContent.isShortAnswerEnabled ? extractFromDelta(this.answerContent.delta) : this.answerContent.rawAnswer;
    const normalizedAnswers = normalizeAnswers(extractedAnswers, AnswerType.STRING);
    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
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
}

export class ExpressionAnswer extends TeamAnswer<string> {
  constructor(config: ITeamAnswerConfig<string>) {
    super(config); // Pass the config to the TeamAnswer constructor

    const extractedAnswers = this.answerContent.isShortAnswerEnabled ? extractFromDelta(this.answerContent.delta) : this.answerContent.rawAnswer;
    const normalizedAnswers = normalizeAnswers(extractedAnswers, AnswerType.EXPRESSION);

    this.answerContent = {
      ...this.answerContent,
      rawAnswer: normalizedAnswers.rawAnswers,
      normAnswer: normalizedAnswers.normAnswers,
      answerType: AnswerType.EXPRESSION
    };
    return this;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    // will use parse and toString to extract expression trees and compare
    // anything more complex than this will require a custom parser (and is probably not worth it)
    // https://mathjs.org/docs/expressions/parsing.html
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
}