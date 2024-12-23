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

export class AIAPIClient
  extends BaseAPIClient
  implements IAIAPIClient
{
  async waegen(
    waegenInput: WaeGenInput    
  ): Promise<string> {
    try{
      console.log(waegenInput);
      const input: WaeGenInput = waegenInput
      console.log(input);
      const variables: WaegenMutationVariables = { input }
      console.log(variables);
      const response = await this.callGraphQL<WaegenMutation>(
          waegen,
          variables as unknown as GraphQLOptions
      )
      return response.data?.waegen || '';
    } catch (error) {
      throw new Error(`Failed to generate question`)
    }
  }

  async waeregen(
    waeregenInput: WaeRegenInput
  ): Promise<string> {
    try{
      const input: WaeRegenInput = waeregenInput
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