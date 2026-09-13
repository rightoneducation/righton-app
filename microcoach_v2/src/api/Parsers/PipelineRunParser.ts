import { IPipelineRun, IPipelineRunSummary } from '../Models/IPipelineRun';

// TEMPORARY — boundary between a MicroCoachPipelineRun row and the shapes the
// preview page reads. Delete with the model.

// The summary columns as AppSync returns them. Structural rather than the
// generated type so the hand-written list query in PipelineRunAPIClient (which
// selects a subset and has no __typename) and the codegen'd get query both fit.
export interface AWSPipelineRunSummary {
  id: string;
  classroomName?: string | null;
  sessionLabel?: string | null;
  condition?: string | null;
  version?: string | null;
  gitSha?: string | null;
  startedAt?: string | null;
  misconceptionCount?: number | null;
}

export interface AWSPipelineRun extends AWSPipelineRunSummary {
  // AWSJSON arrives as a string, not an object.
  manifest?: string | null;
  output?: string | null;
}

// A blob that fails to parse is a row worth seeing, not a page crash — the
// caller falls back to an empty output / manifest and the header shows the id.
function safeParse(raw: string | null | undefined): unknown {
  if (typeof raw !== 'string') return raw ?? null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export class PipelineRunParser {
  static parseSummary(row: AWSPipelineRunSummary): IPipelineRunSummary {
    return {
      id: row.id,
      classroomName: row.classroomName ?? '',
      sessionLabel: row.sessionLabel ?? '',
      condition: row.condition ?? '',
      version: row.version ?? null,
      gitSha: row.gitSha ?? '',
      startedAt: row.startedAt ?? '',
      misconceptionCount: row.misconceptionCount ?? null,
    };
  }

  static parseRun(row: AWSPipelineRun): IPipelineRun {
    const output = safeParse(row.output);
    const manifest = safeParse(row.manifest);
    return {
      ...PipelineRunParser.parseSummary(row),
      output: Array.isArray(output) ? output : [],
      manifest:
        manifest !== null && typeof manifest === 'object' && !Array.isArray(manifest)
          ? (manifest as Record<string, unknown>)
          : {},
    };
  }
}
