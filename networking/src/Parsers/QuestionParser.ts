import { isNullOrUndefined } from "../global";
import { IQuestion, IChoice, IHints, IAnswerSettings, AnswerType, AnswerPrecision, IHostTeamAnswersQuestion } from "../Models";
import { AWSQuestion } from "../Models/AWS";

export class QuestionParser {

  static parseAnswerSettings(input: string): IAnswerSettings {
    const answerSettingsObject = JSON.parse(input);
    if (answerSettingsObject) {
      const answerType = parseInt(answerSettingsObject.answerType, 10);
      if (answerType in AnswerType) {
        answerSettingsObject.answerType = answerType;
      }
      if (answerSettingsObject.answerPrecision !== undefined) {
        const answerPrecision = parseInt(answerSettingsObject.answerPrecision, 10);
        if (answerPrecision in AnswerPrecision) {
          answerSettingsObject.answerPrecision = answerPrecision;
        }
      }
    }
    return answerSettingsObject as IAnswerSettings;
  }

  static questionFromAWSQuestion(
      awsQuestion: AWSQuestion
  ): IQuestion {
   /*$ add parsing answer settings method in here.*/
      let choices: IChoice[] = [];
      if (!isNullOrUndefined(awsQuestion.choices)) {
         try {
          choices = JSON.parse(awsQuestion.choices) as IChoice[]
          } catch (e) {
              console.error(e);
         }
      }
      let answerData: IHostTeamAnswersQuestion | null = null;
      if (!isNullOrUndefined(awsQuestion.answerData)) {
         try {
          answerData = JSON.parse(awsQuestion.answerData) as IHostTeamAnswersQuestion
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
      let hints: IHints[] = [];
      if (!isNullOrUndefined(awsQuestion.hints)) {
         try {
          hints = JSON.parse(awsQuestion.hints) as IHints[]
          } catch (e) {
              console.error(e);
         }
      }
      let answerSettings = QuestionParser.parseAnswerSettings(awsQuestion.answerSettings) as IAnswerSettings;
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
        answerSettings,
        hints,
        answerData: answerData ?? {},
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