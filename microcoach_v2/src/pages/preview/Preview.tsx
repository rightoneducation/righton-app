import React, { useEffect, useMemo, useState } from 'react';
import runRaw from './run.json';
import manifestRaw from './manifest.json';

/**
 * Preview — a scratchpad for eyeballing a pipeline run.
 *
 * Structured around what the pipeline actually does, one collapsible stage per
 * step: surface a misconception, show the evidence that surfaced it, then the
 * activities generated for it.
 *
 * Deliberately NOT wired to IPipelineOutput or the product components: this
 * renders whatever `output.json` contains, so it stays useful while the output
 * shape is still being decided. Fields it doesn't recognise land in the
 * "Uncategorized" section rather than being silently dropped.
 *
 * To point it at a different run, copy that run's output.json (and manifest.json)
 * over run.json / manifest.json in this folder. See the README here for the
 * one-liner that grabs the newest run.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Rec = { [key: string]: Json };

// Bundled fallback so the page renders on a fresh clone, before anyone has run
// `yarn preview:sync`. Once synced, everything below comes from public/preview-runs/.
const bundledRun = runRaw as unknown as Rec[];
const bundledManifest = manifestRaw as unknown as Rec;

interface RunIndexEntry {
  id: string;
  n: number;
  classroom: string;
  session: string;
  condition: string;
  version: string | null;
  startedAt: string;
  misconceptionCount: number | null;
}

const UNTAGGED = '(untagged)';

// Runs grouped by version tag, groups ordered by their newest run. `runs` is
// already newest-first from the sync script, so first-seen order is correct.
function groupByVersion(runs: RunIndexEntry[]): Array<[string, RunIndexEntry[]]> {
  const groups = new Map<string, RunIndexEntry[]>();
  runs.forEach((entry) => {
    const key = entry.version ?? UNTAGGED;
    const existing = groups.get(key);
    if (existing) existing.push(entry);
    else groups.set(key, [entry]);
  });
  return Array.from(groups.entries());
}

type LoadStatus = 'bundled' | 'loading' | 'loaded' | 'error';

const RUN_STORAGE_KEY = 'preview.runId';
const publicUrl = process.env.PUBLIC_URL ?? '';

// localStorage throws outright in some privacy modes; a scratchpad remembering
// your last run is not worth taking the page down over.
function readStoredRunId(): string | null {
  try {
    return window.localStorage.getItem(RUN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeRunId(id: string): void {
  try {
    window.localStorage.setItem(RUN_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

function runLabel(entry: RunIndexEntry): string {
  const bits = [entry.classroom, entry.session, entry.condition].filter((b) => b !== '');
  const when = entry.startedAt === '' ? '' : new Date(entry.startedAt).toLocaleString();
  const tail = when === '' ? '' : ` · ${when}`;
  return `${entry.n} — ${bits.join(' · ') || entry.id}${tail}`;
}

interface SectionDef {
  id: string;
  label: string;
  hint: string;
  defaultOpen: boolean;
  keys: string[];
}

// The pipeline's own stages. Keys not listed here (and not moveOptions/title)
// fall through to the Uncategorized section.
const SECTIONS: SectionDef[] = [
  {
    id: 'core',
    label: 'Misconception',
    hint: 'what it is',
    defaultOpen: false,
    keys: [
      'misconceptionSummary',
      'aiReasoning',
      'example',
      'successIndicators',
      'ccssStandards',
      'isCore',
      'occurrence',
    ],
  },
  {
    id: 'surface',
    label: 'Evidence',
    hint: 'how it surfaced',
    defaultOpen: false,
    keys: [
      'frequency',
      'studentCount',
      'studentPercent',
      'studentGroups',
      'wrongAnswers',
      'wrongAnswerExplanations',
      'correctAnswerSolution',
      'questionErrorRates',
      'ppqQuestions',
      'evidence',
      'sourceMisconceptionId',
      'linkStatus',
    ],
  },
];

const GROUPED_KEYS = new Set<string>([
  ...SECTIONS.flatMap((section) => section.keys),
  'moveOptions',
  'title',
  'id',
]);

function formatValue(key: string, value: Json): Json {
  if (key === 'studentPercent' && typeof value === 'number') {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value;
}

// True when the value renders as a <pre> block, which should span the full grid
// width rather than sit in a narrow column.
function isWide(value: Json): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    return value.length > 0 && !value.every((item) => typeof item === 'string');
  }
  return true;
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
    <div className={isWide(value) ? 'pv-field pv-field-wide' : 'pv-field'}>
      <div className="pv-key">{name}</div>
      <div className="pv-val">{renderValue(formatValue(name, value))}</div>
    </div>
  );
}

function Collapse({
  label,
  hint,
  count,
  defaultOpen,
  allOpen,
  generation,
  children,
}: {
  label: string;
  hint: string;
  count: string;
  defaultOpen: boolean;
  allOpen: boolean | null;
  generation: number;
  children: React.ReactNode;
}) {
  // Remounted whenever `generation` changes so Expand/Collapse all takes effect:
  // <details open> is uncontrolled after first render, so a new key is the
  // cheapest way to re-apply a default.
  return (
    <details className="pv-details" key={generation} open={allOpen ?? defaultOpen}>
      <summary className="pv-summary">
        <span className="pv-chevron" aria-hidden="true">
          ▸
        </span>
        <span className="pv-summary-label">{label}</span>
        {count !== '' && <span className="pv-count">{count}</span>}
        <span className="pv-hint">{hint}</span>
      </summary>
      <div className="pv-details-body">{children}</div>
    </details>
  );
}

/* ── tabs rendering ─────────────────────────────────────────────────────────
 * `moveOptions[].tabs` is the richest part of the output and is consistently
 * shaped across every move, so it gets a real renderer rather than a JSON dump.
 * Content is LaTeX and katex is not a dependency here, so maths renders as
 * monospace source.
 */

const asArray = (v: Json): Rec[] =>
  Array.isArray(v) ? v.filter((x): x is Rec => typeof x === 'object' && x !== null && !Array.isArray(x)) : [];
const asStrings = (v: Json): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
const asRec = (v: Json): Rec | null =>
  v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Rec) : null;
const asStr = (v: Json): string => (typeof v === 'string' ? v : '');

function Callout({ label, text }: { label: string; text: string }) {
  if (text === '') return null;
  return (
    <div className="pv-callout">
      <div className="pv-callout-label">{label}</div>
      <div>{text}</div>
    </div>
  );
}

function Mono({ text }: { text: string }) {
  return <div className="pv-mono">{text}</div>;
}

function StringList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="pv-block">
      <div className="pv-block-label">{`${label} (${items.length})`}</div>
      <ol className="pv-ol">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

function LabelDetail({ label, items }: { label: string; items: Rec[] }) {
  if (items.length === 0) return null;
  return (
    <div className="pv-block">
      <div className="pv-block-label">{label}</div>
      {items.map((item) => (
        <div className="pv-ld" key={`${asStr(item.label)}-${asStr(item.detail).slice(0, 24)}`}>
          <div className="pv-ld-label">{asStr(item.label)}</div>
          <div className="pv-ld-detail">{asStr(item.detail)}</div>
        </div>
      ))}
    </div>
  );
}

function WorkedExample({ example, heading, note }: { example: Rec; heading: string; note: string }) {
  return (
    <div className="pv-we">
      <div className="pv-we-head">
        <span className="pv-we-title">{heading}</span>
        {note !== '' && <span className="pv-we-note">{note}</span>}
      </div>
      <div className="pv-we-sub">problem</div>
      <Mono text={asStr(example.problem)} />
      <div className="pv-we-sub">incorrectWork</div>
      <Mono text={asStr(example.incorrectWork)} />
    </div>
  );
}

function OverviewPanel({ tab }: { tab: Rec }) {
  return (
    <>
      <Callout label="importance" text={asStr(tab.importance)} />
      <div className="pv-two-col">
        <LabelDetail label="What students do" items={asArray(tab.whatStudentsDo)} />
        <LabelDetail label="What you do" items={asArray(tab.whatYouDo)} />
      </div>
    </>
  );
}

const STEP_KEYS = [
  'setup',
  'problem',
  'incorrectWorkedExamples',
  'incorrectWorkedExample1',
  'incorrectWorkedExample2',
  'incorrectWorkedExample3',
  'coreActivity',
  'discussionQuestions',
];

function StepsPanel({ tab }: { tab: Rec }) {
  const examples = asArray(tab.incorrectWorkedExamples);
  // The numbered fields duplicate the array only about half the time, so show
  // one only when it actually differs — a match is noise, a mismatch is signal.
  const divergent = [1, 2, 3]
    .map((n) => ({ n, value: asRec(tab[`incorrectWorkedExample${n}`]) }))
    .filter(({ n, value }) => {
      if (value === null) return false;
      const arrEntry = examples[n - 1];
      return !arrEntry || JSON.stringify(arrEntry) !== JSON.stringify(value);
    });
  const extras = Object.keys(tab).filter((k) => !STEP_KEYS.includes(k));

  return (
    <>
      <StringList label="Setup" items={asStrings(tab.setup)} />
      {asStr(tab.problem) !== '' && (
        <div className="pv-block">
          <div className="pv-block-label">Problem</div>
          <Mono text={asStr(tab.problem)} />
        </div>
      )}
      {examples.length > 0 && (
        <div className="pv-block">
          <div className="pv-block-label">{`Incorrect worked examples (${examples.length})`}</div>
          {examples.map((example, i) => (
            <WorkedExample
              key={asStr(example.problem).slice(0, 32) || `we-${i}`}
              example={example}
              heading={`Example ${i + 1}`}
              note=""
            />
          ))}
        </div>
      )}
      {divergent.length > 0 && (
        <div className="pv-block">
          <div className="pv-block-label">Numbered fields that differ from the array</div>
          {divergent.map(({ n, value }) => (
            <WorkedExample
              key={`num-${n}`}
              example={value as Rec}
              heading={`incorrectWorkedExample${n}`}
              note={`differs from examples[${n - 1}]`}
            />
          ))}
        </div>
      )}
      <StringList label="Core activity" items={asStrings(tab.coreActivity)} />
      <StringList label="Discussion questions" items={asStrings(tab.discussionQuestions)} />
      {extras.map((k) => (
        <Field key={k} name={k} value={tab[k]} />
      ))}
    </>
  );
}

function MaterialsPanel({ tab }: { tab: Rec }) {
  const row = (label: string, items: string[]) =>
    items.length === 0 ? null : (
      <div className="pv-block" key={label}>
        <div className="pv-block-label">{`${label} (${items.length})`}</div>
        <div className="pv-chips">
          {items.map((item) => (
            <span className="pv-chip pv-chip-wide" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  return (
    <>
      {row('Required', asStrings(tab.required))}
      {row('Optional', asStrings(tab.optional))}
    </>
  );
}

function GroupingsPanel({ tab }: { tab: Rec }) {
  const groups = asArray(tab.groups);
  return (
    <>
      <Callout label="ai recommendation" text={asStr(tab.aiRecommendation)} />
      {groups.map((group) => {
        const students = asStrings(group.students);
        return (
          <div className="pv-group" key={asStr(group.name)}>
            <div className="pv-group-head">
              <span className="pv-group-name">{asStr(group.name)}</span>
              <span className="pv-count">{students.length}</span>
            </div>
            <div className="pv-group-desc">{asStr(group.description)}</div>
            <div className="pv-chips">
              {students.map((student) => (
                <span className="pv-chip" key={student}>
                  {student}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

const TAB_ORDER: Array<{ key: string; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'activitySteps', label: 'Activity steps' },
  { key: 'materials', label: 'Materials' },
  { key: 'studentGroupings', label: 'Groupings' },
];

function TabsView({ tabs }: { tabs: Rec }) {
  const known = TAB_ORDER.filter((t) => asRec(tabs[t.key]) !== null);
  const unknown = Object.keys(tabs).filter((k) => !TAB_ORDER.some((t) => t.key === k));
  const all = [...known.map((t) => t.key), ...unknown];
  const [active, setActive] = useState(all[0] ?? '');
  const panel = asRec(tabs[active]);

  if (all.length === 0) return null;

  return (
    <div className="pv-tabs">
      <div className="pv-tabstrip" role="tablist">
        {all.map((key) => {
          const label = TAB_ORDER.find((t) => t.key === key)?.label ?? key;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active === key}
              key={key}
              className={active === key ? 'pv-tab pv-tab-on' : 'pv-tab'}
              onClick={() => setActive(key)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="pv-tabpanel">
        {panel === null && <Field name={active} value={tabs[active]} />}
        {panel !== null && active === 'overview' && <OverviewPanel tab={panel} />}
        {panel !== null && active === 'activitySteps' && <StepsPanel tab={panel} />}
        {panel !== null && active === 'materials' && <MaterialsPanel tab={panel} />}
        {panel !== null && active === 'studentGroupings' && <GroupingsPanel tab={panel} />}
        {panel !== null && !TAB_ORDER.some((t) => t.key === active) && (
          <Field name={active} value={tabs[active]} />
        )}
      </div>
    </div>
  );
}

function MoveCard({ move, index }: { move: Rec; index: number }) {
  const tabs = asRec(move.tabs);
  const keys = Object.keys(move).filter((k) => k !== 'title' && k !== 'id' && k !== 'tabs');
  return (
    <section className="pv-card pv-move">
      <h4 className="pv-card-title">
        <span className="pv-move-idx">{index + 1}</span>
        {typeof move.title === 'string' ? move.title : '(untitled move)'}
      </h4>
      {keys.map((k) => (
        <Field key={k} name={k} value={move[k]} />
      ))}
      {tabs !== null && <TabsView tabs={tabs} />}
    </section>
  );
}

function Misconception({
  item,
  index,
  allOpen,
  generation,
}: {
  item: Rec;
  index: number;
  allOpen: boolean | null;
  generation: number;
}) {
  const moves = Array.isArray(item.moveOptions) ? (item.moveOptions as unknown as Rec[]) : [];
  const uncategorized = Object.keys(item).filter((k) => !GROUPED_KEYS.has(k));
  const anchor = `m-${typeof item.id === 'string' ? item.id : index}`;

  return (
    <article className="pv-section" id={anchor}>
      <h2 className="pv-h2">
        <span className="pv-idx">{index + 1}</span>
        {typeof item.title === 'string' ? item.title : '(untitled)'}
        {typeof item.frequency === 'string' && <span className="pv-tag">{item.frequency}</span>}
        {typeof item.studentCount === 'number' && (
          <span className="pv-tag pv-tag-alt">{`${item.studentCount} students`}</span>
        )}
        <span className="pv-tag pv-tag-alt">{`${moves.length} moves`}</span>
      </h2>

      {SECTIONS.map((section) => {
        const present = section.keys.filter((k) => item[k] !== undefined);
        if (present.length === 0) return null;
        return (
          <Collapse
            key={section.id}
            label={section.label}
            hint={section.hint}
            count=""
            defaultOpen={section.defaultOpen}
            allOpen={allOpen}
            generation={generation}
          >
            <div className="pv-fields">
              {present.map((k) => (
                <Field key={k} name={k} value={item[k]} />
              ))}
            </div>
          </Collapse>
        );
      })}

      <Collapse
        label="Activities"
        hint="generated moves"
        count={String(moves.length)}
        defaultOpen={false}
        allOpen={allOpen}
        generation={generation}
      >
        <div className="pv-grid-moves">
          {moves.map((move, i) => (
            <MoveCard
              key={typeof move.id === 'string' ? move.id : `move-${i}`}
              move={move}
              index={i}
            />
          ))}
        </div>
      </Collapse>

      {uncategorized.length > 0 && (
        <Collapse
          label="Uncategorized"
          hint="not yet grouped"
          count={String(uncategorized.length)}
          defaultOpen={false}
          allOpen={allOpen}
          generation={generation}
        >
          <div className="pv-fields">
            {uncategorized.map((k) => (
              <Field key={k} name={k} value={item[k]} />
            ))}
          </div>
        </Collapse>
      )}

      <Collapse
        label="Raw JSON"
        hint=""
        count=""
        defaultOpen={false}
        allOpen={allOpen}
        generation={generation}
      >
        <pre className="pv-pre pv-raw">{JSON.stringify(item, null, 2)}</pre>
      </Collapse>
    </article>
  );
}

function Header({
  items,
  manifest,
  runs,
  activeId,
  status,
  onSelectRun,
  onExpandAll,
  onCollapseAll,
}: {
  items: Rec[];
  manifest: Rec;
  runs: RunIndexEntry[];
  activeId: string;
  status: LoadStatus;
  onSelectRun: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
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
      <div className="pv-header-top">
        <div className="pv-runpick">
          {runs.length > 0 && (
            <select
              className="pv-select"
              value={activeId}
              onChange={(e) => onSelectRun(e.target.value)}
              aria-label="Select run"
            >
              {groupByVersion(runs).map(([version, entries]) => (
                <optgroup label={version} key={version}>
                  {entries.map((entry) => (
                    <option value={entry.id} key={entry.id}>
                      {runLabel(entry)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
          <div className="pv-runid">
            {String(manifest.runId ?? 'unknown run')}
            {status === 'loading' && <span className="pv-note">loading…</span>}
            {status === 'error' && <span className="pv-note pv-bad">failed to load run</span>}
            {status === 'bundled' && runs.length === 0 && (
              <span className="pv-note">bundled snapshot — run `yarn preview:sync` for the full list</span>
            )}
          </div>
        </div>
        <div className="pv-actions">
          <button type="button" className="pv-btn" onClick={onExpandAll}>
            Expand all
          </button>
          <button type="button" className="pv-btn" onClick={onCollapseAll}>
            Collapse all
          </button>
        </div>
      </div>

      <div className="pv-stats">
        {stat('condition', String(manifest.condition ?? '—'))}
        {stat(
          'version',
          typeof manifest.version === 'string' && manifest.version !== '' ? (
            <span className="pv-tag">{manifest.version}</span>
          ) : (
            <span className="pv-nil">untagged</span>
          ),
        )}
        {stat('misconceptions', String(manifest.misconceptionCount ?? items.length))}
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

      <nav className="pv-jump">
        {items.map((item, i) => (
          <a
            className="pv-jump-link"
            key={typeof item.id === 'string' ? item.id : `jump-${i}`}
            href={`#m-${typeof item.id === 'string' ? item.id : i}`}
          >
            <span className="pv-jump-idx">{i + 1}</span>
            {typeof item.title === 'string' ? item.title : '(untitled)'}
          </a>
        ))}
      </nav>
    </header>
  );
}

const STYLES = `
.pv-wrap { font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1a1d21; background: #f4f5f7; min-height: 100vh; padding-bottom: 64px; }
.pv-header { position: sticky; top: 0; z-index: 10; background: #fff;
  border-bottom: 1px solid #d7dbe0; padding: 12px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.pv-header-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.pv-runid { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
  color: #5b636b; }
.pv-runpick { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-width: 0; }
.pv-select { font: inherit; font-size: 13px; font-weight: 600; color: #1a1d21; background: #fff;
  border: 1px solid #cfd5dc; border-radius: 6px; padding: 4px 8px; max-width: 460px; cursor: pointer; }
.pv-note { margin-left: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px; color: #8b939c; }
.pv-actions { display: flex; gap: 8px; flex: none; }
.pv-btn { background: #fff; border: 1px solid #cfd5dc; border-radius: 6px; padding: 4px 10px;
  font-size: 12px; cursor: pointer; color: #4b535c; }
.pv-btn:hover { background: #f2f4f7; }
.pv-stats { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 8px; }
.pv-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #79818a; }
.pv-stat-value { font-size: 14px; font-weight: 600; }
.pv-ok { color: #1a7f4b; } .pv-bad { color: #c02b2b; }
.pv-jump { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;
  border-top: 1px solid #eef0f3; padding-top: 8px; }
.pv-jump-link { display: inline-flex; align-items: center; gap: 6px; text-decoration: none;
  font-size: 12px; color: #3d444b; background: #f2f4f7; border-radius: 5px; padding: 3px 9px; }
.pv-jump-link:hover { background: #e5e9ef; }
.pv-jump-idx { display: inline-flex; align-items: center; justify-content: center; width: 16px;
  height: 16px; border-radius: 8px; background: #2f6df6; color: #fff; font-size: 10px;
  font-weight: 700; }
.pv-section { margin: 24px 20px; scroll-margin-top: 190px; }
.pv-h2 { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 18px;
  margin: 0 0 10px; }
.pv-idx, .pv-move-idx { display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 11px; background: #2f6df6; color: #fff;
  font-size: 12px; font-weight: 700; flex: none; }
.pv-move-idx { background: #6b7280; width: 18px; height: 18px; font-size: 11px; margin-right: 8px; }
.pv-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
  background: #e5edff; color: #2f5bd0; border-radius: 4px; padding: 2px 7px; }
.pv-tag-alt { background: #eceff3; color: #4b535c; }
.pv-details { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; margin-bottom: 8px; }
.pv-summary { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px 14px;
  list-style: none; user-select: none; }
.pv-summary::-webkit-details-marker { display: none; }
.pv-summary:hover { background: #fafbfc; }
.pv-chevron { display: inline-block; transition: transform .12s ease; color: #8b939c;
  font-size: 11px; }
.pv-details[open] > .pv-summary > .pv-chevron { transform: rotate(90deg); }
.pv-summary-label { font-size: 13px; font-weight: 600; }
.pv-count { background: #eceff3; color: #4b535c; border-radius: 9px; padding: 0 7px;
  font-size: 11px; font-weight: 600; }
.pv-hint { font-size: 12px; color: #8b939c; }
.pv-details-body { padding: 4px 14px 14px; border-top: 1px solid #f0f2f4; }
.pv-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0 20px; }
.pv-field { padding: 8px 0; border-bottom: 1px solid #f4f6f8; min-width: 0; }
.pv-field-wide { grid-column: 1 / -1; }
.pv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
.pv-card { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 14px 16px;
  min-width: 0; }
.pv-move { border-left: 3px solid #9aa3ad; }
.pv-card-title { display: flex; align-items: center; font-size: 13px; font-weight: 600;
  color: #2c3238; margin: 0 0 10px; }
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
.pv-raw { max-height: 600px; }

/* tabs */
.pv-grid-moves { display: grid; grid-template-columns: repeat(auto-fit, minmax(560px, 1fr));
  gap: 14px; }
.pv-tabs { margin-top: 12px; border-top: 1px solid #eef0f3; padding-top: 10px; }
.pv-tabstrip { display: flex; flex-wrap: wrap; gap: 4px; background: #f2f4f7; border-radius: 7px;
  padding: 3px; }
.pv-tab { flex: 1 1 auto; background: transparent; border: 0; border-radius: 5px; padding: 5px 10px;
  font-size: 12px; font-weight: 600; color: #5b636b; cursor: pointer; }
.pv-tab:hover { color: #1a1d21; }
.pv-tab-on { background: #fff; color: #1a1d21; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.pv-tabpanel { padding-top: 12px; }
.pv-two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
.pv-block { margin-bottom: 14px; min-width: 0; }
.pv-block-label { font-size: 11px; text-transform: uppercase; letter-spacing: .06em;
  color: #79818a; font-weight: 600; margin-bottom: 6px; }
.pv-ol { margin: 0; padding-left: 20px; font-size: 13px; }
.pv-ol li { margin-bottom: 5px; }
.pv-ld { margin-bottom: 8px; }
.pv-ld-label { font-size: 12px; font-weight: 700; color: #2f5bd0; }
.pv-ld-detail { font-size: 13px; }
.pv-callout { background: #f6f8fc; border-left: 3px solid #2f6df6; border-radius: 0 6px 6px 0;
  padding: 9px 12px; margin-bottom: 14px; font-size: 13px; }
.pv-callout-label { font-size: 10px; text-transform: uppercase; letter-spacing: .06em;
  color: #6b7d9e; font-weight: 700; margin-bottom: 3px; }
.pv-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
  line-height: 1.55; white-space: pre-wrap; word-break: break-word; background: #f7f8fa;
  border: 1px solid #e6e9ed; border-radius: 6px; padding: 9px 11px; overflow-x: auto; }
.pv-we { border: 1px solid #e6e9ed; border-radius: 7px; padding: 10px 12px; margin-bottom: 10px; }
.pv-we-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.pv-we-title { font-size: 12px; font-weight: 700; }
.pv-we-note { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
  background: #fdecec; color: #c02b2b; border-radius: 4px; padding: 2px 6px; }
.pv-we-sub { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px;
  color: #8b939c; margin: 7px 0 3px; }
.pv-group { border: 1px solid #e6e9ed; border-radius: 7px; padding: 10px 12px; margin-bottom: 10px; }
.pv-group-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.pv-group-name { font-size: 13px; font-weight: 700; }
.pv-group-desc { font-size: 13px; margin-bottom: 8px; }
.pv-chip-wide { font-family: inherit; }
`;

export default function Preview() {
  const [runs, setRuns] = useState<RunIndexEntry[]>([]);
  const [activeId, setActiveId] = useState('');
  const [items, setItems] = useState<Rec[]>(() => (Array.isArray(bundledRun) ? bundledRun : []));
  const [manifest, setManifest] = useState<Rec>(bundledManifest);
  const [status, setStatus] = useState<LoadStatus>('bundled');
  const [allOpen, setAllOpen] = useState<boolean | null>(null);
  const [generation, setGeneration] = useState(0);

  // Load the run index once. A miss is expected and fine — nobody has synced
  // yet, so the bundled snapshot stays on screen.
  useEffect(() => {
    let cancelled = false;
    fetch(`${publicUrl}/preview-runs/index.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('no index'))))
      .then((list: RunIndexEntry[]) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        setRuns(list);
        const stored = readStoredRunId();
        const match = list.find((entry) => entry.id === stored);
        setActiveId(match ? match.id : list[0].id);
      })
      .catch(() => {
        /* stay on the bundled snapshot */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load whichever run is selected.
  useEffect(() => {
    if (activeId === '') return undefined;
    let cancelled = false;
    setStatus('loading');
    Promise.all([
      fetch(`${publicUrl}/preview-runs/${activeId}/output.json`).then((r) => r.json()),
      fetch(`${publicUrl}/preview-runs/${activeId}/manifest.json`)
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ])
      .then(([output, loadedManifest]) => {
        if (cancelled) return;
        setItems(Array.isArray(output) ? (output as Rec[]) : []);
        setManifest((loadedManifest ?? {}) as Rec);
        setStatus('loaded');
        // Collapse state belongs to the run that produced it — carrying it over
        // leaves sections from the previous run hanging open.
        setAllOpen(null);
        setGeneration((g) => g + 1);
        storeRunId(activeId);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const setAll = (open: boolean) => {
    setAllOpen(open);
    setGeneration((g) => g + 1);
  };

  const shown = useMemo(() => items, [items]);

  return (
    <div className="pv-wrap">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Header
        items={shown}
        manifest={manifest}
        runs={runs}
        activeId={activeId}
        status={status}
        onSelectRun={setActiveId}
        onExpandAll={() => setAll(true)}
        onCollapseAll={() => setAll(false)}
      />
      {shown.map((item, i) => (
        <Misconception
          key={`${activeId}-${typeof item.id === 'string' ? item.id : `m-${i}`}`}
          item={item}
          index={i}
          allOpen={allOpen}
          generation={generation}
        />
      ))}
    </div>
  );
}
