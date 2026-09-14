import {
  ContextDataType,
  CreateContextDataInput,
  CreateContextDataMutation,
  CreateContextDataMutationVariables,
  DeleteContextDataMutation,
  DeleteContextDataMutationVariables,
  GetContextDataQuery,
  GetContextDataQueryVariables,
  ListContextDataQuery,
  ListContextDataQueryVariables,
  UpdateContextDataInput,
  UpdateContextDataMutation,
  UpdateContextDataMutationVariables,
} from "../../../AWSAPI";
import {
  createContextData,
  deleteContextData,
  updateContextData,
} from "../../../graphql/mutations";
import { getContextData, listContextData } from "../../../graphql/queries";
import { IMicroCoachContextData } from "../../Models/IMicroCoachContextData";
import { ContextDataParser } from "../../Parsers/ContextDataParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IContextDataAPIClient } from "./interfaces/IContextDataAPIClient";

export class ContextDataAPIClient
  extends BaseAPIClient
  implements IContextDataAPIClient
{
  async getContextData(id: string): Promise<IMicroCoachContextData | null> {
    if (!id) return null;

    const variables: GetContextDataQueryVariables = { id };
    const res = await this.callGraphQL<GetContextDataQuery>(
      getContextData,
      variables as unknown as GraphQLOptions,
    );

    const contextData = res?.data?.getContextData;
    return contextData
      ? ContextDataParser.parseIMicroCoachContextDatafromAWSContextData(
          contextData,
        )
      : null;
  }

  async listContextData(): Promise<IMicroCoachContextData[]> {
    const variables: ListContextDataQueryVariables = {};
    return this.listContextDataWithVariables(variables);
  }

  async listContextDataByType(
    type: ContextDataType,
  ): Promise<IMicroCoachContextData[]> {
    const variables: ListContextDataQueryVariables = {
      filter: {
        type: {
          eq: type,
        },
      },
    };

    return this.listContextDataWithVariables(variables);
  }

  async createContextData(
    input: CreateContextDataInput,
  ): Promise<IMicroCoachContextData | null> {
    const variables: CreateContextDataMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateContextDataMutation>(
      createContextData,
      variables as unknown as GraphQLOptions,
    );

    const contextData = res?.data?.createContextData;
    return contextData
      ? ContextDataParser.parseIMicroCoachContextDatafromAWSContextData(
          contextData,
        )
      : null;
  }

  async updateContextData(
    input: UpdateContextDataInput,
  ): Promise<IMicroCoachContextData | null> {
    const variables: UpdateContextDataMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateContextDataMutation>(
      updateContextData,
      variables as unknown as GraphQLOptions,
    );

    const contextData = res?.data?.updateContextData;
    return contextData
      ? ContextDataParser.parseIMicroCoachContextDatafromAWSContextData(
          contextData,
        )
      : null;
  }

  async deleteContextData(id: string): Promise<IMicroCoachContextData | null> {
    if (!id) return null;

    const variables: DeleteContextDataMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteContextDataMutation>(
      deleteContextData,
      variables as unknown as GraphQLOptions,
    );

    const contextData = res?.data?.deleteContextData;
    return contextData
      ? ContextDataParser.parseIMicroCoachContextDatafromAWSContextData(
          contextData,
        )
      : null;
  }

  private async listContextDataWithVariables(
    variables: ListContextDataQueryVariables,
  ): Promise<IMicroCoachContextData[]> {
    const res = await this.callGraphQL<ListContextDataQuery>(
      listContextData,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.listContextData?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        ContextDataParser.parseIMicroCoachContextDatafromAWSContextData(item),
      );
  }
}
