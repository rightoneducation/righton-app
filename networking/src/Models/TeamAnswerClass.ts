import { symbolicEqual } from 'mathjs';
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
  currentState: GameSessionState | null;
  currentQuestionIndex: number | null;
}

export interface IBaseAnswerConfig<T> {
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
  constructor(config: IBaseAnswerConfig<T>) 
    {
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

  abstract normalize(answerContent: ITeamAnswerContent): BaseAnswer<T>;
  // abstract isEqualTo(answer: BaseAnswer<T>): Boolean
}

function isNumeric (num: any){ // eslint-disable-line @typescript-eslint/no-explicit-any
  return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && 
    !isNaN(num as number); // eslint-disable-line no-restricted-globals
}


function extractAndNormalizeFromDelta(currentContents: any, answerType: AnswerType) {
  const rawAnswers = [];
  const normAnswers = [];
  for (let i = 0; i < currentContents.ops.length; i++) {
    const currentItem = currentContents.ops[i].insert;
    switch (answerType) {
      case AnswerType.NUMBER:
        if (!currentItem?.formula && isNumeric(currentItem)) {
          // if it's a number, check for percentages and convert to decimal
          const percentagesRegex = /\d+(\.\d+)?%/g;
          const extractPercents = currentItem.match(percentagesRegex);
          const percentages = extractPercents ? parseFloat(extractPercents[1]) / 100 : null
          if (!isNullOrUndefined(percentages))
             normAnswers.push(percentages);
          // then remove spaces and push
          const normItem = Number(currentItem.trim());
          if (!isNullOrUndefined(normItem) && !isNullOrUndefined(normItem)) {
            rawAnswers.push(currentItem);
            normAnswers.push(normItem);
          }
        }
        break;
      case AnswerType.STRING:
        if (!currentItem?.formula && !isNumeric(currentItem)) {
          // if it's a string, pull out any numbers and remove spaces
          const normItem = currentItem.toLowerCase().replace(/[\d\r\n]+/g, '').trim();
          if (!isNullOrUndefined(normItem) && !isNullOrUndefined(normItem)) {
            rawAnswers.push(currentItem);
            normAnswers.push(normItem);
          }
        }
        break;
      case AnswerType.EXPRESSION:
        if (currentItem?.formula) {
          // if it's a formula, remove spaces
          const normItem = currentItem.formula.replace(/(\r\n|\n|\r|\s|" ")/gm, '').trim();
          if (!isNullOrUndefined(normItem) && !isNullOrUndefined(normItem)) {
            rawAnswers.push(currentItem);
            normAnswers.push(normItem);
          }
        }
        break;
    }
  }
  return {rawAnswers, normAnswers};
}

export class NumberAnswer extends BaseAnswer<number> {
  constructor(config: IBaseAnswerConfig<number>) {
    super(config); // Pass the config to the BaseAnswer constructor
  }

  normalize(): NumberAnswer {
    const extractedAnswers = extractAndNormalizeFromDelta(this.answerContent.delta, AnswerType.NUMBER);
    console.log(extractedAnswers);
    const answer = new NumberAnswer({
      ...this,
      answerContent: {
        ...this.answerContent,
        rawAnswer: extractedAnswers.rawAnswers,
        normAnswer: extractedAnswers.normAnswers,
        answerType: AnswerType.NUMBER
      }
    });
    return answer;
  }

  isEqualTo(otherAnswers: number[]): Boolean {
    if (this.answerContent.normAnswer && this.answerContent.normAnswer.some((answer) => otherAnswers.includes(answer as number))) {
      return true;
    }
    return false;
  }
}

export class StringAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the BaseAnswer constructor
  }

  normalize(): StringAnswer {
    const extractedAnswers = extractAndNormalizeFromDelta(this.answerContent.delta, AnswerType.STRING);
    const answer = new StringAnswer({
      ...this,
      answerContent: {
        ...this.answerContent,
        rawAnswer: extractedAnswers.rawAnswers,
        normAnswer: extractedAnswers.normAnswers,
        answerType: AnswerType.STRING
      }
    });
    return answer;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    const otherAnswersSet = new Set(otherAnswers);
    if (this.answerContent.normAnswer && this.answerContent.normAnswer.some((answer) => otherAnswersSet.has(answer as string))) {
      return true;
    }
    return false;
  }
}

export class ExpressionAnswer extends BaseAnswer<string> {
  constructor(config: IBaseAnswerConfig<string>) {
    super(config); // Pass the config to the BaseAnswer constructor
  }

  normalize(): ExpressionAnswer {
    const extractedAnswers = extractAndNormalizeFromDelta(this.answerContent.delta, AnswerType.EXPRESSION);
    const answer = new ExpressionAnswer({
      ...this,
      answerContent: {
        ...this.answerContent,
        rawAnswer: extractedAnswers.rawAnswers,
        normAnswer: extractedAnswers.normAnswers,
        answerType: AnswerType.EXPRESSION
      }
    });
    return answer;
  }

  isEqualTo(otherAnswers: string[]): Boolean {
    // will use symbolicEqual from mathjs to compare expressions
    // https://mathjs.org/docs/reference/functions/symbolicEqual.html
    if (this.answerContent.normAnswer) {
      for (let i =0; i < this.answerContent.normAnswer.length; i++) {
        for (let y = 0; y < otherAnswers.length; y++) {
          try {
            if (symbolicEqual(this.answerContent.normAnswer[i].toString(), otherAnswers[y]) 
              || this.answerContent.normAnswer[i].toString() === otherAnswers[y].toString()
            ) {
              return true;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
   return false;
  }
}