
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { MaskOptionEnum } from '../../types';

const RUNS_ROOT = path.resolve(__dirname, '../../runs');

export interface RunOptions {
  classroomId: string;
  classroomName: string;
  sessionId: string;
  sessionLabel: string;
  amplifyEnv: string;
  condition?: MaskOptionEnum;
}

export interface CallTrace {
  resolvedPrompt?: string;
  model?: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null;
  subCalls?: Array<{
    label: string;
    model: string;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null;
    fellBack?: boolean;
    reason?: string;
  }>;
  [key: string]: any;
}

function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const slug = (s: string) =>
  (s || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);

export class RunCapture {
  readonly dir: string;
  readonly runId: string;
  private seq = 0;
  private readonly startedAt = Date.now();
  private readonly opts: RunOptions;

  /** Aggregated across every model call in this run. */
  private tokens = { prompt: 0, completion: 0, total: 0 };
  private models = new Set<string>();
  private fallbacks: Array<{ call: string; label: string; reason?: string }> = [];
  private extras: Record<string, any> = {};

  constructor(opts: RunOptions) {
    this.opts = opts;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const cond = `-${slug(opts.condition ?? MaskOptionEnum.NONE)}`;
    this.runId = `${slug(opts.classroomName)}-${slug(opts.sessionLabel)}${cond}-${stamp}`;
    this.dir = path.join(RUNS_ROOT, this.runId);
    fs.mkdirSync(path.join(this.dir, 'calls'), { recursive: true });
    fs.mkdirSync(path.join(this.dir, 'prompts'), { recursive: true });
  }

  private write(rel: string, data: unknown) {
    const body = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    fs.writeFileSync(path.join(this.dir, rel), body);
  }

  /** The unmasked graph payload — scoring ground truth. */
  writeSnapshot(snapshot: unknown) {
    this.write('kg-snapshot.json', snapshot);
  }

  /** What was actually injected into the prompts (differs from the snapshot only when a condition is applied). */
  writeInjected(payload: unknown) {
    this.write('kg-injected.json', payload);
  }

  /**
   * Record one Lambda call. Pulls `_trace` out of the response when present so the
   * resolved prompt lands in prompts/ as readable text rather than escaped JSON.
   */
  recordCall(name: string, input: unknown, output: any) {
    const n = String(++this.seq).padStart(2, '0');
    const trace: CallTrace | undefined = output?._trace;

    if (trace?.model) this.models.add(trace.model);

    const addUsage = (u: CallTrace['usage']) => {
      if (!u) return;
      this.tokens.prompt += u.prompt_tokens ?? 0;
      this.tokens.completion += u.completion_tokens ?? 0;
      this.tokens.total += u.total_tokens ?? 0;
    };

    const subCalls = trace?.subCalls ?? [];
    for (const sc of subCalls) {
      if (sc.model) this.models.add(sc.model);
      addUsage(sc.usage);
      if (sc.fellBack) this.fallbacks.push({ call: name, label: sc.label, reason: sc.reason });
    }
    // A Lambda that makes a single model call reports usage at the top level with no
    // subCalls. Counting only subCalls silently zeroed those out of every manifest.
    if (subCalls.length === 0) addUsage(trace?.usage);

    this.write(`calls/${n}-${name}.json`, { name, at: new Date().toISOString(), input, output });
    if (trace?.resolvedPrompt) {
      this.write(`prompts/${n}-${name}.txt`, trace.resolvedPrompt);
    }
  }

  /** Anything worth putting in the manifest that isn't derived from calls. */
  note(key: string, value: any) {
    this.extras[key] = value;
  }

  writeOutput(nextSteps: unknown) {
    this.write('output.json', nextSteps);
  }

  finish(summary: Record<string, any> = {}) {
    const manifest = {
      runId: this.runId,
      startedAt: new Date(this.startedAt).toISOString(),
      finishedAt: new Date().toISOString(),
      wallClockMs: Date.now() - this.startedAt,
      gitSha: gitSha(),
      amplifyEnv: this.opts.amplifyEnv,
      condition: this.opts.condition ?? MaskOptionEnum.NONE,
      classroomId: this.opts.classroomId,
      classroomName: this.opts.classroomName,
      sessionId: this.opts.sessionId,
      sessionLabel: this.opts.sessionLabel,
      models: [...this.models].sort(),
      tokens: this.tokens,
      modelCalls: this.seq,
      silentFallbacks: this.fallbacks,
      ...this.extras,
      ...summary,
    };
    this.write('manifest.json', manifest);
    return manifest;
  }
}

/** Disabled capture — same surface, writes nothing. Keeps call sites branch-free. */
export class NoopCapture {
  readonly dir = '(capture disabled)';
  readonly runId = '';
  writeSnapshot() {}
  writeInjected() {}
  recordCall() {}
  note() {}
  writeOutput() {}
  finish() { return null as any; }
}

export type Capture = RunCapture | NoopCapture;
