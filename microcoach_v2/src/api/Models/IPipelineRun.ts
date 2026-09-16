// TEMPORARY — pairs with the MicroCoachPipelineRun model at the bottom of
// schema.graphql. Delete with it.

// The dropdown columns: what `listRuns()` selects. Deliberately excludes the
// two AWSJSON blobs so a list of many runs stays small.
export interface IPipelineRunSummary {
  id: string; // = runId, the directory name under seed/eval/runs/
  classroomName: string;
  sessionLabel: string;
  condition: string;
  version: string | null;
  gitSha: string;
  startedAt: string; // ISO; '' when the manifest had none
  misconceptionCount: number | null;
}

// One full run. `output` is whatever the pipeline emitted — the preview page
// renders it structurally and does not depend on IPipelineOutput on purpose.
export interface IPipelineRun extends IPipelineRunSummary {
  output: unknown[];
  manifest: Record<string, unknown>;
}
