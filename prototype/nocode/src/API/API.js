import { Amplify } from "aws-amplify";
import { generateClient } from "@aws-amplify/api";
import { createStoredData, updateStoredData } from "../graphql/mutations";
import awsconfig from "../aws-exports";

export const client = generateClient({});

export class API {
  constructor(){
    this.configAmplify(awsconfig);
  }

  configAmplify(awsconfig) {
    Amplify.configure(awsconfig);
  }

  static async create() {
    return new API(); 
  }

  // phase 1 and phase 2 update functions
  async savePhase1Response(existingData, answer) {
    let query;
    const isFirstResponse = existingData && existingData.phase1Responses.length === 0;
    const newData = {
      input: {
        date: new Date().toISOString(),
      }
    }
    if (isFirstResponse){
      query = createStoredData;
      newData.input.phase1Responses = JSON.stringify([answer]);
      return client.graphql({query: query, variables: newData});
    } 
    query = updateStoredData;
    const existingResponses = existingData.phase1Responses;
    const updatedResponses = [...existingResponses, answer];
    const updatedData = { 
      input: {
        id: existingData.id,
        phase1Responses: JSON.stringify(updatedResponses),
      }
    }
    return client.graphql({query: query, variables: updatedData});
  }

  async savePhase2Response(existingData, answer) {
    let query;
    const isFirstResponse = existingData && existingData.phase2Responses.length === 0;
    const newData = {
      input: {
        date: new Date().toISOString(),
      }
    }
    if (isFirstResponse){
      query = createStoredData;
      newData.input.phase2Responses = JSON.stringify([answer]);
      return client.graphql({query: query, variables: newData});
    } 
    query = updateStoredData;
    const existingResponses = existingData.phase2Responses;
    const updatedResponses = [...existingResponses, answer];
    const updatedData = {
      input: {
        id: existingData.id,
        phase2Responses: JSON.stringify(updatedResponses),
      }
    }
    return client.graphql({query: query, variables: updatedData});
  }
}
