import { GraphQLResult } from '@aws-amplify/api';
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { BaseAPIClient, client } from '../base/BaseAPIClient';
import { IPipelineRunAPIClient } from './interfaces/IPipelineRunAPIClient';
import { IPipelineRun, IPipelineRunSummary } from '../../Models/IPipelineRun';
import {
  AWSPipelineRunSummary,
  PipelineRunParser,
} from '../../Parsers/PipelineRunParser';
import { GetMicroCoachPipelineRunQuery } from '../../../AWSAPI';
import { getMicroCoachPipelineRun } from '../../../graphql/queries';

// TEMPORARY — reads the MicroCoachPipelineRun table for /preview. Teardown:
// delete this folder, Parsers/PipelineRunParser.ts, Models/IPipelineRun.ts,
// the registrations in APIClients.ts / IAPIClients.ts / index.ts, and the
// schema block.

// Hand-written on purpose: the codegen'd listMicroCoachPipelineRuns selects
// `output` and `manifest`, which would drag every run's JSON into the dropdown
// fetch. Lives here rather than under src/graphql/ because that glob is
// codegen input (.graphqlconfig.yml) and would be overwritten.
const LIST_PIPELINE_RUN_SUMMARIES = /* GraphQL */ `
  query ListPipelineRunSummaries($limit: Int, $nextToken: String) {
    listMicroCoachPipelineRuns(limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomName
        sessionLabel
        condition
        version
        gitSha
        startedAt
        misconceptionCount
      }
      nextToken
    }
  }
`;

interface ListPipelineRunSummariesQuery {
  listMicroCoachPipelineRuns?: {
    items: Array<AWSPipelineRunSummary | null>;
    nextToken?: string | null;
  } | null;
}

export class PipelineRunAPIClient extends BaseAPIClient implements IPipelineRunAPIClient {
  // BaseAPIClient.callGraphQL picks userPool | iam from the session, and this
  // API has no IAM provider — a signed-out /preview would fail. The model
  // carries an apiKey rule for exactly this, so go to the shared client with
  // apiKey explicitly and leave BaseAPIClient untouched.
  private apiKeyQuery<T>(query: string, variables: Record<string, unknown>): Promise<GraphQLResult<T>> {
    const response = client.graphql({
      query,
      variables,
      authMode: 'apiKey' as GraphQLAuthMode,
    }) as unknown;
    return response as Promise<GraphQLResult<T>>;
  }

  // Every row's summary columns, unsorted — ordering and per-version numbering
  // are the page's concern. Pages through nextToken; the table is expected to
  // hold tens of rows, not thousands.
  async listRuns(): Promise<IPipelineRunSummary[]> {
    const out: IPipelineRunSummary[] = [];
    let nextToken: string | null = null;
    do {
      // eslint-disable-next-line no-await-in-loop
      const res: GraphQLResult<ListPipelineRunSummariesQuery> = await this.apiKeyQuery<ListPipelineRunSummariesQuery>(
        LIST_PIPELINE_RUN_SUMMARIES,
        { limit: 100, nextToken },
      );
      const page = res.data?.listMicroCoachPipelineRuns;
      (page?.items ?? []).forEach((row) => {
        if (row) out.push(PipelineRunParser.parseSummary(row));
      });
      nextToken = page?.nextToken ?? null;
    } while (nextToken);
    return out;
  }

  async getRun(id: string): Promise<IPipelineRun | null> {
    if (!id) return null;
    const res = await this.apiKeyQuery<GetMicroCoachPipelineRunQuery>(getMicroCoachPipelineRun, { id });
    const row = res.data?.getMicroCoachPipelineRun;
    return row ? PipelineRunParser.parseRun(row) : null;
  }
}
