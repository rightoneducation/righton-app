import React, { useMemo, useState } from 'react';
import runRaw from './run.json';
import manifestRaw from './manifest.json';

/**
 * Preview — a scratchpad for eyeballing a pipeline run.
 *
 * Deliberately NOT wired to IPipelineOutput or the product components: this
 * renders whatever `output.json` actually contains, so it stays useful while the
 * output shape is still being decided. Anything the pipeline adds shows up in
 * the "Uncategorized" card rather than being silently dropped.
 *
 * To point it at a different run, copy that run's output.json (and manifest.json)
 * over run.json / manifest.json in this folder. See the README here for the
 * one-liner that grabs the newest run.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Rec = { [key: string]: Json };

const run = runRaw as unknown as Rec[];
const manifest = manifestRaw as unknown as Rec;

// Field groupings. Keys not listed here (and not moveOptions/title) fall through
// to the Uncategorized card.
const GROUPS: Array<[string, string[]]> = [
  ['Identity', ['id', 'sourceMisconceptionId', 'linkStatus', 'isCore', 'occurrence']],
  ['Frequency', ['frequency', 'studentCount', 'studentPercent', 'studentGroups']],
  ['Narrative', ['misconceptionSummary', 'aiReasoning', 'example', 'successIndicators']],
  [
    'Evidence',
    [
      'wrongAnswers',
      'wrongAnswerExplanations',
      'correctAnswerSolution',
      'questionErrorRates',
      'ppqQuestions',
      'evidence',
    ],
  ],
  ['Standards', ['ccssStandards']],
];

const GROUPED_KEYS = new Set<string>([
  ...GROUPS.flatMap(([, keys]) => keys),
  'moveOptions',
  'title',
]);

function formatValue(key: string, value: Json): Json {
  if (key === 'studentPercent' && typeof value === 'number') {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value;
}

function renderValue(value: Json): React.ReactNode {
  if (value === null || value === undefined) return <span className="pv-nil">—</span>;
  if (typeof value === 'string') {
    return value.trim() === '' ? <span className="pv-nil">(empty)</span> : <span>{value}</span>;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="pv-num">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="pv-nil">(none)</span>;
    if (value.every((item) => typeof item === 'string')) {
      return (
        <div className="pv-chips">
          {(value as string[]).map((item) => (
            <span className="pv-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      );
    }
  }
  return <pre className="pv-pre">{JSON.stringify(value, null, 2)}</pre>;
}

function Field({ name, value }: { name: string; value: Json }) {
  return (
    <div className="pv-field">
      <div className="pv-key">{name}</div>
      <div className="pv-val">{renderValue(formatValue(name, value))}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pv-card">
      <h3 className="pv-card-title">{title}</h3>
      {children}
    </section>
  );
}

function MoveCard({ move, index }: { move: Rec; index: number }) {
  const keys = Object.keys(move).filter((k) => k !== 'title' && k !== 'id');
  return (
    <section className="pv-card pv-move">
      <h3 className="pv-card-title">
        <span className="pv-move-idx">{index + 1}</span>
        {typeof move.title === 'string' ? move.title : '(untitled move)'}
      </h3>
      {keys.map((k) => (
        <Field key={k} name={k} value={move[k]} />
      ))}
    </section>
  );
}

function Misconception({ item, index }: { item: Rec; index: number }) {
  const [rawOpen, setRawOpen] = useState(false);
  const moves = Array.isArray(item.moveOptions) ? (item.moveOptions as unknown as Rec[]) : [];
  const uncategorized = Object.keys(item).filter((k) => !GROUPED_KEYS.has(k));

  return (
    <article className="pv-section">
      <h2 className="pv-h2">
        <span className="pv-idx">{index + 1}</span>
        {typeof item.title === 'string' ? item.title : '(untitled)'}
        {typeof item.frequency === 'string' && <span className="pv-tag">{item.frequency}</span>}
        {typeof item.studentCount === 'number' && (
          <span className="pv-tag pv-tag-alt">{item.studentCount} students</span>
        )}
      </h2>

      <div className="pv-grid">
        {GROUPS.map(([label, keys]) => {
          const present = keys.filter((k) => item[k] !== undefined);
          if (present.length === 0) return null;
          return (
            <Card title={label} key={label}>
              {present.map((k) => (
                <Field key={k} name={k} value={item[k]} />
              ))}
            </Card>
          );
        })}

        {uncategorized.length > 0 && (
          <Card title="Uncategorized">
            {uncategorized.map((k) => (
              <Field key={k} name={k} value={item[k]} />
            ))}
          </Card>
        )}
      </div>

      <h3 className="pv-h3">{`Move options (${moves.length})`}</h3>
      <div className="pv-grid">
        {moves.map((move, i) => (
          <MoveCard key={typeof move.id === 'string' ? move.id : `move-${i}`} move={move} index={i} />
        ))}
      </div>

      <button type="button" className="pv-raw-btn" onClick={() => setRawOpen(!rawOpen)}>
        {rawOpen ? 'Hide raw JSON' : 'Show raw JSON'}
      </button>
      {rawOpen && <pre className="pv-pre pv-raw">{JSON.stringify(item, null, 2)}</pre>}
    </article>
  );
}

function Header() {
  const tokens = manifest.tokens as { total?: number } | undefined;
  const fallbacks = Array.isArray(manifest.silentFallbacks) ? manifest.silentFallbacks : [];
  const models = Array.isArray(manifest.models) ? (manifest.models as string[]) : [];
  const stat = (label: string, value: React.ReactNode) => (
    <div className="pv-stat" key={label}>
      <div className="pv-stat-label">{label}</div>
      <div className="pv-stat-value">{value}</div>
    </div>
  );

  return (
    <header className="pv-header">
      <div className="pv-runid">{String(manifest.runId ?? 'unknown run')}</div>
      <div className="pv-stats">
        {stat('condition', String(manifest.condition ?? '—'))}
        {stat('misconceptions', String(manifest.misconceptionCount ?? run.length))}
        {stat('activities', String(manifest.activityCount ?? '—'))}
        {stat(
          'source linked',
          `${manifest.sourceMisconceptionMatched ?? '?'}/${manifest.sourceMisconceptionAvailable ?? '?'}`,
        )}
        {stat('wrong-answer linked', String(manifest.wrongAnswerLinked ?? '—'))}
        {stat('tokens', tokens?.total ? tokens.total.toLocaleString() : '—')}
        {stat(
          'silent fallbacks',
          <span className={fallbacks.length ? 'pv-bad' : 'pv-ok'}>{fallbacks.length}</span>,
        )}
        {stat('env', String(manifest.amplifyEnv ?? '—'))}
        {stat('models', models.join(', ') || '—')}
      </div>
    </header>
  );
}

const STYLES = `
.pv-wrap { font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1a1d21; background: #f4f5f7; min-height: 100vh; padding-bottom: 64px; }
.pv-header { position: sticky; top: 0; z-index: 10; background: #fff;
  border-bottom: 1px solid #d7dbe0; padding: 12px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.pv-runid { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
  color: #5b636b; margin-bottom: 8px; }
.pv-stats { display: flex; flex-wrap: wrap; gap: 20px; }
.pv-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #79818a; }
.pv-stat-value { font-size: 14px; font-weight: 600; }
.pv-ok { color: #1a7f4b; } .pv-bad { color: #c02b2b; }
.pv-section { margin: 24px 20px; background: transparent; }
.pv-h2 { display: flex; align-items: center; gap: 10px; font-size: 18px; margin: 0 0 12px; }
.pv-idx, .pv-move-idx { display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 11px; background: #2f6df6; color: #fff;
  font-size: 12px; font-weight: 700; flex: none; }
.pv-move-idx { background: #6b7280; width: 18px; height: 18px; font-size: 11px; margin-right: 8px; }
.pv-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
  background: #e5edff; color: #2f5bd0; border-radius: 4px; padding: 2px 7px; }
.pv-tag-alt { background: #eceff3; color: #4b535c; }
.pv-h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #79818a;
  margin: 20px 0 10px; }
.pv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
.pv-card { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 14px 16px;
  min-width: 0; }
.pv-move { border-left: 3px solid #9aa3ad; }
.pv-card-title { display: flex; align-items: center; font-size: 12px; text-transform: uppercase;
  letter-spacing: .06em; color: #5b636b; margin: 0 0 10px; }
.pv-field { padding: 7px 0; border-top: 1px solid #f0f2f4; min-width: 0; }
.pv-field:first-of-type { border-top: 0; padding-top: 0; }
.pv-key { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px;
  color: #8b939c; margin-bottom: 3px; }
.pv-val { font-size: 13px; word-break: break-word; }
.pv-num { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #1f6f4a; }
.pv-nil { color: #a8afb6; font-style: italic; }
.pv-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.pv-chip { background: #eef1f4; border-radius: 4px; padding: 2px 7px; font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.pv-pre { background: #f7f8fa; border: 1px solid #e6e9ed; border-radius: 6px; padding: 10px;
  font-size: 12px; line-height: 1.45; overflow-x: auto; margin: 4px 0 0; max-height: 320px; }
.pv-raw { max-height: 600px; margin-top: 10px; }
.pv-raw-btn { margin-top: 14px; background: #fff; border: 1px solid #cfd5dc; border-radius: 6px;
  padding: 5px 11px; font-size: 12px; cursor: pointer; color: #4b535c; }
.pv-raw-btn:hover { background: #f2f4f7; }
`;

export default function Preview() {
  const items = useMemo(() => (Array.isArray(run) ? run : []), []);
  return (
    <div className="pv-wrap">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Header />
      {items.map((item, i) => (
        <Misconception key={typeof item.id === 'string' ? item.id : `m-${i}`} item={item} index={i} />
      ))}
    </div>
  );
}
