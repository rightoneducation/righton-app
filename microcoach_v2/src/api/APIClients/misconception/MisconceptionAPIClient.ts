import {
  MicroCoachMisconceptionsBySessionIdQuery,
  MicroCoachMisconceptionsBySessionIdQueryVariables,
} from "../../../AWSAPI";
import { microCoachMisconceptionsBySessionId } from "../../../graphql/queries";
import { IMisconception } from "../../../lib/PipelineModels";
import { MisconceptionParser } from "../../Parsers/MisconceptionParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IMisconceptionAPIClient } from "./interfaces/IMisconceptionAPIClient";

export class MisconceptionAPIClient
  extends BaseAPIClient
  implements IMisconceptionAPIClient
{
  async getMisconceptionsBySessionId(sessionId: string): Promise<IMisconception[]> {
    if (!sessionId) return [];

    const variables: MicroCoachMisconceptionsBySessionIdQueryVariables = {
      sessionId,
    };

    const res = await this.callGraphQL<MicroCoachMisconceptionsBySessionIdQuery>(
      microCoachMisconceptionsBySessionId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachMisconceptionsBySessionId?.items ?? [];

    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        MisconceptionParser.parseIMisconceptionfromAWSMisconception(item),
      );
  }
}
