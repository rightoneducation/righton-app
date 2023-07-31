import { isNullOrUndefined } from "../IApiClient";
import {
  AWSGameQuestion,
  AWSQuestion,
  IChoice,
  IGameQuestion,
  IQuestion,
} from "../Models";

export default abstract class QuestionParser {
  static questionsFromAWSQuestions(
    awsQuestions: Array<AWSQuestion | null>
  ): Array<IQuestion> {
    return awsQuestions
      .map((awsQuestion) => {
        if (isNullOrUndefined(awsQuestion)) {
          throw new Error("Question cannot be null.");
        }
        return {
          id: awsQuestion.id,
          text: awsQuestion.text,
          choices: isNullOrUndefined(awsQuestion.choices)
            ? []
            : this.parseServerArray<IChoice>(awsQuestion.choices),
          imageUrl: awsQuestion.imageUrl,
          instructions: isNullOrUndefined(awsQuestion.instructions)
            ? []
            : this.parseServerArray<string>(awsQuestion.instructions),
          standard: awsQuestion.standard,
          cluster: awsQuestion.cluster,
          domain: awsQuestion.domain,
          grade: awsQuestion.grade,
          gameSessionId: awsQuestion.gameSessionId,
          order: awsQuestion.order,
        } as IQuestion;
      })
      .sort((lhs, rhs) => {
        return lhs.order - rhs.order;
      });
  }

  static questionsFromAWSGameQuestions(
    awsQuestions: Array<AWSGameQuestion | null> | undefined | null
  ): Array<IGameQuestion> {
    return (awsQuestions ?? []).map((awsQuestion) => {
      return this.gameQuestionFromAWSGameQuestion(awsQuestion);
    });
  }

  static gameQuestionFromAWSGameQuestion(
    awsQuestion: AWSGameQuestion | null | undefined
  ): IGameQuestion {
    if (isNullOrUndefined(awsQuestion)) {
      throw new Error("Question cannot be null.");
    }
    return {
      id: awsQuestion.id,
      text: awsQuestion.text,
      choices: isNullOrUndefined(awsQuestion.choices)
        ? []
        : this.parseServerArray<IChoice>(awsQuestion.choices),
      imageUrl: awsQuestion.imageUrl,
      instructions: isNullOrUndefined(awsQuestion.instructions)
        ? []
        : this.parseServerArray<string>(awsQuestion.instructions),
      standard: awsQuestion.standard,
      cluster: awsQuestion.cluster,
      domain: awsQuestion.domain,
      grade: awsQuestion.grade,
    } as IGameQuestion;
  }

  // Private methods
  private static parseServerArray<T>(input: any | T[]): Array<T> {
    if (input instanceof Array) {
      return input as T[];
    } else if (typeof input === "string") {
      return JSON.parse(input as string);
    }
    return [];
  }
}
