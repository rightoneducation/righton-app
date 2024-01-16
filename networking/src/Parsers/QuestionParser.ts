import { isNullOrUndefined } from "../IApiClient";
import { IQuestion, IChoice } from "../Models";
import { AWSQuestion } from "../Models/AWS";

export class QuestionParser {
  static questionFromAWSQuestion(
      awsQuestion: AWSQuestion
  ): IQuestion {

      let choices: IChoice[] = [];
      if (!isNullOrUndefined(awsQuestion.choices)) {
         try {
          choices = JSON.parse(awsQuestion.choices) as IChoice[]
          } catch (e) {
              console.error(e);
         }
      }
      let responses: string[] = [];
      if (!isNullOrUndefined(awsQuestion.responses)) {
         try {
          responses = JSON.parse(awsQuestion.responses) as string[]
          } catch (e) {
              console.error(e);
         }
      }
      let instructions: string[] = [];
      if (!isNullOrUndefined(awsQuestion.instructions)) {
         try {
          instructions = JSON.parse(awsQuestion.instructions) as string[]
          } catch (e) {
              console.error(e);
         }
      }
      // destructure AWSGameTemplate and assign default values if null
      const {
        id,
        text,
        gameSessionId,
        order,
        isConfidenceEnabled,
        isShortAnswerEnabled,
        isHintEnabled,
        imageUrl = awsQuestion.imageUrl ?? '',
        standard = awsQuestion.standard ?? '',
        cluster = awsQuestion.cluster ?? '',
        domain = awsQuestion.domain ?? '',
        grade = awsQuestion.grade ?? '',
      } = awsQuestion || {}

      if (isNullOrUndefined(id) ||
          isNullOrUndefined(text) ||
          isNullOrUndefined(gameSessionId) ||
          isNullOrUndefined(order) ||
          isNullOrUndefined(isConfidenceEnabled) ||
          isNullOrUndefined(isShortAnswerEnabled) ||
          isNullOrUndefined(isHintEnabled)) {
          throw new Error(
              "Question has null field for the attributes that are not nullable"
          )
      }

      const question: IQuestion = {
        id,
        text,
        responses,
        gameSessionId,
        order,
        isConfidenceEnabled,
        isShortAnswerEnabled,
        isHintEnabled,
        choices,
        imageUrl,
        instructions,
        standard,
        cluster,
        domain,
        grade,
      } as IQuestion;

      return question
  }
}