Placeholder for NoCode Prototyping


Dev Prompt:
I would like you to produce a react.js webapp (without typescript) that generates code that I can use with a create-react-app set up. 
I want to analyze user data by saving it to a backend (via graphQL functions generated via aws-amplify) and controlled via an API.

My engineer has created the following API.js for me:

```
import { Amplify } from "aws-amplify";
import { GraphQLResult, generateClient } from "@aws-amplify/api";
import { createStoredData, updateStoredData } from "../graphql/mutations";
import awsconfig from "../aws-exports";
import { date } from "zod";

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
```

It is used as such:

```
const api = useAPI();
  const handleButtonClick = () => {
    const existingData = {
      phase1Responses: []
    }
    api.savePhase1Response(existingData, "answer");
  }

  const handleButton2Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"]
    }
    api.savePhase1Response(existingData, "answer2");
  }

  const handleButton3Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"],
      phase2Responses: []
    }
    api.savePhase2Response(existingData, "answer");
  }

  const handleButton4Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"],
      phase2Responses: ["answer"]
    }
    api.savePhase2Response(existingData, "answer2");
  }
```

When creating the app, ensure that it uses the above API to save data to the backend (so that I can analyze user data that is saved on every response).
