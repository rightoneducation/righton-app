

import { Amplify} from "aws-amplify"
import { generateClient } from 'aws-amplify/api';
import { createQuestions, createDiscardedExplanation } from "../graphql/mutations";
import { listQuestions, listDiscardedExplanations } from "../graphql/queries";
import { IQuestion, IQuestionToSave, IWrongAnswerExplanations, IRegenInput, IDiscardedExplanationToSave } from "./Models";
import awsconfig from "../aws-exports"

const client = generateClient();
Amplify.configure(awsconfig);

const genEndpoint = `https://dhfrlmuvjd.execute-api.us-east-1.amazonaws.com/wronganswerexp-dev`;
const regenEndpoint = 'https://uzfkcuoui1.execute-api.us-east-1.amazonaws.com/regenerateWrongAnswerExplanation/regenwronganswerexp-dev';
const compareEndpoint = 'https://u9a79nroqd.execute-api.us-east-1.amazonaws.com/labeledits-dev';

export async function generateWrongAnswerExplanations(
  question: IQuestion,
  discardedExplanations: IDiscardedExplanationToSave[]
): Promise<IWrongAnswerExplanations | null> {
    try{
        const response = 
            fetch(genEndpoint, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    connection: "keep-alive",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    question,
                    discardedExplanations
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .then((response) => {
                return response.wrongAnswerExplanations;
            })
        return response;
    } catch (e) {
        console.log(e);
    }
    return null;
}

export async function regenerateWrongAnswerExplanation(
    regenInputObj: IRegenInput
  ): Promise<IWrongAnswerExplanations> {
    return fetch(regenEndpoint, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            regenInputObj
        }),
    })
        .then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then((response) => {
            return response.newWrongAnswerExplanation;
        })
  }

export async function createQuestion(
    question: IQuestionToSave
  ): Promise<IQuestionToSave> {
    let result = await client.graphql({
        query: createQuestions, 
        variables: {
          input: {
            question: question.question,
            correctAnswer: question.correctAnswer, 
            wrongAnswers: JSON.stringify(question.wrongAnswers),
            version: question.version 
          }
        }
      }) as { data: any; };
    return result.data.createQuestion;
};

export async function returnQuestions(): Promise<any> {
    const result = await client.graphql({ query: listQuestions}) as { data: any; };
    return result.data.listQuestions.items;
}

export async function saveDiscardedExplanation(
    discardedExplanationInput: IDiscardedExplanationToSave
): Promise<IDiscardedExplanationToSave>{
    let result = await client.graphql({
        query: createDiscardedExplanation,
        variables: {
            input: discardedExplanationInput
        }
    }) as { data: any; };
    return result.data.createDiscardedExplanation;
}

export async function getDiscardedExplanations(
    limit: 10
): Promise<IDiscardedExplanationToSave[]>{
    let result = await client.graphql({
        query: listDiscardedExplanations,
        variables: {
            limit
        }
    }) as {data: any;};
    return result.data.listDiscardedExplanations;
}

export async function compareEditedExplanation(
    originalExplanation: string,
    editedExplanation: string
  ): Promise<string | null> {
      try{
        console.log(originalExplanation);
        console.log(editedExplanation);
          const response = 
              fetch(compareEndpoint, {
                  method: "POST",
                  headers: {
                      "content-type": "application/json",
                      connection: "keep-alive",
                      "Access-Control-Allow-Origin": "*",
                  },
                  body: JSON.stringify({
                      originalExplanation,
                      editedExplanation
                  }),
              })
              .then((response) => {
                  if (!response.ok) {
                      console.log(response);
                      throw new Error(response.statusText)
                  }
                  return response.json()
              })
              .then((response) => {
                  return response.editedReason;
              })
          return response;
      } catch (e) {
          console.log(e);
      }
      return null;
  }