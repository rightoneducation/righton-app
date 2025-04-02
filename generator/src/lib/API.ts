

import { Amplify} from "aws-amplify"
import { generateClient } from 'aws-amplify/api';
import { createSavedExplanation, createDiscardedExplanation } from "../graphql/mutations";
import { listSavedExplanations, listDiscardedExplanations } from "../graphql/queries";
import { IQuestion, IExplanationToSave, IWrongAnswerExplanation, IWrongAnswerExplanations, IDiscardedExplanationToSave, IDiscardedExplanationSaveInput } from "./Models";
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
        console.log(response);
        return response;
    } catch (e) {
        console.log(e);
    }
    return null;
}

export async function regenerateWrongAnswerExplanation(
    regenInputObj: IExplanationToSave
  ): Promise<IWrongAnswerExplanation> {
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

export async function createExplanation(
    explanation: IExplanationToSave
  ): Promise<IExplanationToSave> {
    let result = await client.graphql({
        query: createSavedExplanation, 
        variables: {
          input: {
            question: explanation.question,
            correctAnswer: explanation.correctAnswer, 
            wrongAnswer: explanation.wrongAnswer,
            genExplanation: JSON.stringify(explanation.genExplanation),
            discardedExplanations: JSON.stringify(explanation.discardedExplanations),
            version: explanation.version 
          }
        },
        authMode: "iam"
      }) as { data: any; };
    return result.data.createQuestion;
};

export async function returnQuestions(): Promise<any> {
    const result = await client.graphql({ 
        query: listSavedExplanations,
        authMode: "iam"
    }
    ) as { data: any; };
    return result.data.listSavedExplanations.items;
}

export async function saveDiscardedExplanation(
    discardedExplanationInput: IDiscardedExplanationSaveInput
): Promise<IDiscardedExplanationToSave>{
    let result = await client.graphql({
        query: createDiscardedExplanation,
        variables: {
            input: discardedExplanationInput
        },
        authMode: "iam"
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
        },
        authMode: "iam"
    }) as {data: any;};
    return result.data.listDiscardedExplanations;
}

export async function compareEditedExplanation(
    originalExplanation: string,
    editedExplanation: string
  ): Promise<string | null> {
      try{
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