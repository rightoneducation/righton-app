import {
  WaeGenInput,
  WaegenMutationVariables,
  WaegenMutation,
  WaeRegenInput,
  WaeregenMutationVariables,
  WaeregenMutation
} from '../../AWSMobileApi'
import { GraphQLOptions } from "../BaseAPIClient";
import { waegen, waeregen } from '../../graphql';
import { BaseAPIClient } from '../BaseAPIClient';
import IAIAPIClient from './interfaces/IAIAPIClient';
import { RegenInput } from '../../AI/models/AIButtonModels';

export class AIAPIClient
  extends BaseAPIClient
  implements IAIAPIClient
{
  async waegen(
    waegenInput: WaeGenInput    
  ): Promise<string> {
    try{
      const input: WaeGenInput = waegenInput
      const variables: WaegenMutationVariables = { input }
      const response = await this.callGraphQL<WaegenMutation>(
          waegen,
          variables as unknown as GraphQLOptions
      )
      return response.data?.waegen || '';
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to generate question`)
    }
  }

  async waeregen(
    waeregenInput: RegenInput
  ): Promise<string> {
    try{
      const awsInput = {...waeregenInput, discardedExplanations: JSON.stringify(waeregenInput.discardedExplanations)}
      const input: WaeRegenInput = awsInput
      const variables: WaeregenMutationVariables = { input }
      const response = await this.callGraphQL<WaeregenMutation>(
          waeregen,
          variables as unknown as GraphQLOptions
      )
      return response.data?.waeregen || '';
    } catch (error) {
      throw new Error(`Failed to regenerate question`)
    }
  }
}