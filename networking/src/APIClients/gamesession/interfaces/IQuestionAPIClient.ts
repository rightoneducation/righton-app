import { IQuestion } from "../../../Models";
import { UpdateQuestionInput } from "../../../AWSMobileApi";

export interface IQuestionAPIClient {
  updateQuestion(input: UpdateQuestionInput): Promise<IQuestion>;
}