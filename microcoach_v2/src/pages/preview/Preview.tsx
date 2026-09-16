import React, { useEffect, useMemo, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Rec,
  RunIndexEntry,
  LoadStatus,
  groupByVersion,
  runLabel,
  asArray,
  asStrings,
  asRec,
  asStr,
  usePipelineRun,
} from './shared';
import { FORMULAE } from './formulae';
import MathText from '../../components/MathText';
import { STAGES, GROUPS, Stage, Who, Origin } from './pipeline';

/**
 * Preview — how the pipeline works, shown on a real run.
 *
 * Presents the pipeline itself: the stages in the current iteration, every formula they
 * apply (and whether code or the model applies it), then each misconception
 * from the selected run collapsed to the three things the pipeline produced for
 * it — the misconception, the instructional need with the inputs that ranked
 * it, and the activity templates selected.
 *
 * The pipeline diagram and formulae are static: they describe the code on this
 * branch, not the run's version tag. The run supplies the misconceptions.
 */

const WHO_LABEL: Record<Who, string> = { api: 'API', code: 'code', llm: 'LLM' };

function WhoBadge({ who }: { who: Who }) {
  return <span className={`p2-who p2-who-${who}`}>{WHO_LABEL[who]}</span>;
}

function OriginTag({ origin }: { origin: Origin }) {
  return (
    <a className="p2-origin" href={origin.href} target="_blank" rel="noreferrer">
      {origin.label} ↗
    </a>
  );
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

function StageCard({ stage, n }: { stage: Stage; n: number }) {
  return (
    // tabIndex so keyboard focus opens the tip too.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="p2-stage" tabIndex={0}>
      <div className="p2-stage-head">
        <span className="p2-stage-n">{n}</span>
        <WhoBadge who={stage.who} />
      </div>
      <div className="p2-stage-label">{stage.label}</div>
      <div className="p2-stage-sub">{stage.subtitle}</div>
      <div className="p2-stage-tip">
        <div className="p2-stage-where">{stage.where}</div>
        <p className="p2-stage-detail">{stage.detail}</p>
        <ul className="p2-stage-out">
          {stage.out.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PipelineFlow({ models }: { models: string[] }) {
  const byId = new Map(STAGES.map((st, i) => [st.id, { stage: st, n: i + 1 }]));
  const card = (id: string) => {
    const hit = byId.get(id);
    return hit ? <StageCard stage={hit.stage} n={hit.n} key={id} /> : null;
  };
  return (
    <section className="p2-section p2-section-wide">
      <h2 className="p2-h2">Pipeline</h2>
      <p className="p2-lede">
        Current iteration, in run order. <WhoBadge who="api" /> fetches from a service,{' '}
        <WhoBadge who="code" /> computes from the response rows, <WhoBadge who="llm" /> is a model call
        {models.length > 0 ? ` (${models.join(', ')})` : ''}. Boxes show how often each part runs. Hover a step
        for detail.
      </p>
      <ol className="p2-flow">
        {GROUPS.map((g) => {
          const innerIds = new Set(g.inner?.stageIds ?? []);
          // Stages outside the inner box render as-is; the inner box's stages render
          // together at the position of the first one.
          const parts: React.ReactNode[] = [];
          let innerDone = false;
          g.stageIds.forEach((id) => {
            if (!innerIds.has(id)) {
              parts.push(card(id));
            } else if (!innerDone) {
              innerDone = true;
              parts.push(
                <div className="p2-inner" key={`inner-${g.id}`}>
                  <div className="p2-inner-label">{g.inner?.label}</div>
                  <div className="p2-inner-stages">{g.inner?.stageIds.map(card)}</div>
                </div>,
              );
            }
          });
          return (
            <li className="p2-group" key={g.id} style={{ flexGrow: g.stageIds.length }}>
              <div className="p2-group-head">
                <span className="p2-group-label">{g.label}</span>
                <span className="p2-group-cadence">{g.cadence}</span>
              </div>
              <div className="p2-group-stages">{parts}</div>
              {g.caveat && <div className="p2-group-caveat">{g.caveat}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── Formulae ──────────────────────────────────────────────────────────────────

function Formulae() {
  const byId = new Map(STAGES.map((st, i) => [st.id, { stage: st, n: i + 1 }]));
  return (
    <section className="p2-section p2-section-wide">
      <h2 className="p2-h2">Formulae</h2>
      <p className="p2-lede">
        Every computation between the response rows and the selected template, in the same boxes as the pipeline
        above. Constants are as written in the source named on each card.
      </p>
      <ol className="p2-flow p2-flow-static">
        {GROUPS.map((g) => {
          const cards = g.stageIds.flatMap((stageId) =>
            FORMULAE.filter((f) => f.stageId === stageId).map((f) => {
              const hit = byId.get(stageId);
              return (
                <article className="p2-formula" key={f.id}>
                  <div className="p2-formula-head">
                    {hit && <span className="p2-stage-n">{hit.n}</span>}
                    <span className="p2-formula-title">
                      {hit && <span className="p2-formula-stage">{hit.stage.label} · </span>}
                      {f.title}
                    </span>
                    <WhoBadge who={f.who} />
                  </div>
                  {f.origin && (
                    <div className="p2-origin-row">
                      <span className="p2-origin-label">Logic from:</span>
                      <OriginTag origin={f.origin} />
                    </div>
                  )}
                  <ol className="p2-steps">
                    {f.steps.map((step) => (
                      <li key={step.text}>
                        <div>{step.text}</div>
                        {step.tex && (
                          <div className="p2-tex">
                            <MathText text={`$$${step.tex}$$`} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="p2-formula-src">{f.source}</div>
                  {f.notes.length > 0 && (
                    <ul className="p2-notes">
                      {f.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            }),
          );
          // Boxes with nothing to compute (fetch-only, under construction) are left out.
          if (cards.length === 0) return null;
          return (
            <li className="p2-group" key={g.id} style={{ flexGrow: g.stageIds.length }}>
              <div className="p2-group-head">
                <span className="p2-group-label">{g.label}</span>
              </div>
              <div className="p2-group-formulae">{cards}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── Misconception cards ───────────────────────────────────────────────────────

const pct = (v: unknown): string => (typeof v === 'number' ? `${Math.round(v * 100)}%` : '');

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="p2-nil">—</span>;
  return (
    <span className="p2-chips">
      {items.map((s) => (
        <span className="p2-chip" key={s}>
          {s}
        </span>
      ))}
    </span>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="p2-row">
      <div className="p2-row-k">{k}</div>
      <div className="p2-row-v">{v}</div>
    </div>
  );
}

function Block({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="p2-block">
      <div className="p2-block-head">
        <span className="p2-block-label">{label}</span>
        <span className="p2-block-hint">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function MisconceptionBlock({ item }: { item: Rec }) {
  const refs = asArray(item.wrongAnswers).map((w) => `Q${String(w.questionNumber)}·${asStr(w.letter)}`);
  const ccss = asRec(item.ccssStandards);
  const target = ccss ? asRec(ccss.targetObjective) : null;
  return (
    <Block label="Misconception" hint="LLMGenMisconception · from the questions">
      <p className="p2-text">
        {asStr(item.misconceptionSummary) ? (
          <MathText text={asStr(item.misconceptionSummary)} />
        ) : (
          <span className="p2-nil">no summary</span>
        )}
      </p>
      <Row k="wrong answers" v={<Chips items={refs} />} />
      {target && <Row k="standard" v={<span className="p2-mono">{asStr(target.standard)}</span>} />}
      {asStr(item.learningScienceConnection) !== '' && (
        <Row k="learning science" v={<span>{asStr(item.learningScienceConnection)}</span>} />
      )}
    </Block>
  );
}

function NeedBlock({ item }: { item: Rec }) {
  const need = asRec(item.instructionalNeed);
  const r = asRec(item.rationale);
  if (!need && !r) {
    return (
      <Block label="Instructional need" hint="LLMGenInstrNeed">
        <span className="p2-nil">none on this item</span>
      </Block>
    );
  }
  return (
    <Block label="Instructional need" hint="LLMGenInstrNeed · need + priority inputs">
      {need && (
        <>
          <p className="p2-callout">
            <MathText text={asStr(need.text)} />
          </p>
          <Row k="teacher role" v={<span>{asStr(need.teacherRole) || '—'}</span>} />
        </>
      )}
      {r && (
        <div className="p2-inputs">
          <div className="p2-inputs-head">Priority inputs</div>
          <Row k="prevalence · 0.40" v={<span>{asStr(r.prevalence) || '—'}</span>} />
          <Row k="conceptual severity · 0.30" v={<span className="p2-mono">{String(r.conceptualSeverity ?? '—')}</span>} />
          <Row k="prerequisite gaps · 0.15" v={<Chips items={asStrings(r.prerequisiteGaps)} />} />
          <Row k="forward impact · 0.15" v={<Chips items={asStrings(r.forwardImpact)} />} />
          <Row k="confidence signal" v={<span>{asStr(r.confidenceSignal) || '—'}</span>} />
          <Row k="→ priority rank" v={<span className="p2-rank-inline">#{String(r.priorityRank ?? '—')}</span>} />
        </div>
      )}
      {r && asStr(r.whyThisNeed) !== '' && <Row k="why this need" v={<MathText text={asStr(r.whyThisNeed)} />} />}
    </Block>
  );
}

function TemplateBlock({ item }: { item: Rec }) {
  const sel = asRec(item.selectedTemplates);
  const top2 = sel ? asArray(sel.top2) : [];
  if (!sel || top2.length === 0) {
    return (
      <Block label="Activity selected" hint="LLMSelectTemplate">
        <span className="p2-nil">no selection on this item</span>
      </Block>
    );
  }
  return (
    <Block label="Activity selected" hint="LLMSelectTemplate · top two templates">
      <div className="p2-picks">
        {top2.map((pick, i) => {
          // The model sometimes returns the string "null" rather than null.
          const distinct = asStr(pick.distinctFrom);
          const showDistinct = distinct !== '' && distinct !== 'null';
          return (
            <div className="p2-pick" key={`${asStr(pick.templateId)}-${asStr(pick.rationale).slice(0, 24)}`}>
              <div className="p2-pick-head">
                <span className="p2-pick-n">{i + 1}</span>
                <span className="p2-pick-id">{asStr(pick.templateId)}</span>
                <span className={asStr(pick.fit) === 'strong' ? 'p2-fit p2-fit-strong' : 'p2-fit'}>
                  {asStr(pick.fit) || '?'}
                </span>
              </div>
              <div className="p2-text">
                <MathText text={asStr(pick.rationale)} />
              </div>
              {showDistinct && <div className="p2-distinct">distinct from pick 1: {distinct}</div>}
            </div>
          );
        })}
      </div>
    </Block>
  );
}

function MisconceptionCard({
  item,
  index,
  open,
  generation,
}: {
  item: Rec;
  index: number;
  open: boolean;
  generation: number;
}) {
  const rank = typeof item.priorityRank === 'number' ? item.priorityRank : index + 1;
  const sel = asRec(item.selectedTemplates);
  const topPick = sel ? asArray(sel.top2)[0] : null;
  const count = typeof item.studentCount === 'number' ? item.studentCount : null;
  return (
    // Remounted on `generation` so Expand/Collapse all re-applies the default:
    // <details open> is uncontrolled after first render.
    <details className="p2-card" key={generation} open={open}>
      <summary className="p2-card-summary">
        <span className="p2-chevron" aria-hidden="true">
          ▸
        </span>
        <span className="p2-rank">#{rank}</span>
        <span className="p2-card-title">{asStr(item.title) || '(untitled)'}</span>
        {count !== null && (
          <span className="p2-meta">
            {count} students{pct(item.studentPercent) ? ` · ${pct(item.studentPercent)}` : ''}
          </span>
        )}
        {topPick && <span className="p2-meta p2-meta-template">{asStr(topPick.templateId)}</span>}
      </summary>
      <div className="p2-card-body">
        <MisconceptionBlock item={item} />
        <NeedBlock item={item} />
        <TemplateBlock item={item} />
      </div>
    </details>
  );
}

// ── Run bar ───────────────────────────────────────────────────────────────────

// Where reviewers leave feedback on what this page shows.
const COMMENTS_DOC = 'https://docs.google.com/document/d/1cRwPZ1bL2TnYl0KKLsviWSD0tPh-5c8eWsU3jHylHxA/edit?usp=sharing';

function RunBar({
  runs,
  activeId,
  status,
  manifest,
  count,
  onSelectRun,
  onExpandAll,
  onCollapseAll,
}: {
  runs: RunIndexEntry[];
  activeId: string;
  status: LoadStatus;
  manifest: Rec;
  count: number;
  onSelectRun: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  const stat = (label: string, value: React.ReactNode) => (
    <span className="p2-stat" key={label}>
      <span className="p2-stat-k">{label}</span>
      <span className="p2-stat-v">{value}</span>
    </span>
  );
  return (
    <header className="p2-bar">
      <div className="p2-bar-row">
        {runs.length > 0 && (
          <select
            className="p2-select"
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
        {status === 'loading' && <span className="p2-note">loading…</span>}
        {status === 'error' && <span className="p2-note p2-bad">failed to load run</span>}
        <span className="p2-spacer" />
        <button type="button" className="p2-btn" onClick={onExpandAll}>
          Expand all
        </button>
        <button type="button" className="p2-btn" onClick={onCollapseAll}>
          Collapse all
        </button>
        <a className="p2-btn p2-btn-primary" href={COMMENTS_DOC} target="_blank" rel="noreferrer">
          Add Comments ↗
        </a>
      </div>
      <div className="p2-bar-row p2-stats">
        {stat('version', asStr(manifest.version) || 'untagged')}
        {stat('condition', String(manifest.condition ?? '—'))}
        {stat('misconceptions', String(manifest.misconceptionCount ?? count))}
        {stat('needs', `${manifest.instructionalNeedsGenerated ?? '—'}/${manifest.misconceptionCount ?? count}`)}
        {stat('templates', `${manifest.templatesSelected ?? '—'}/${manifest.misconceptionCount ?? count}`)}
      </div>
    </header>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const STYLES = `
.p2-wrap { font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1a1d21;
  background: #f4f5f7; min-height: 100vh; padding-bottom: 64px; }
.p2-bar { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid #d7dbe0;
  padding: 10px 24px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.p2-bar-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.p2-stats { margin-top: 6px; gap: 18px; }
.p2-spacer { flex: 1; }
.p2-select { font: inherit; font-size: 13px; font-weight: 600; background: #fff; border: 1px solid #cfd5dc;
  border-radius: 6px; padding: 4px 8px; max-width: 520px; cursor: pointer; }
.p2-note { font-size: 11px; color: #8b939c; }
.p2-btn { background: #fff; border: 1px solid #cfd5dc; border-radius: 6px; padding: 4px 10px; font-size: 12px;
  cursor: pointer; color: #4b535c; }
.p2-btn:hover { background: #f2f4f7; }
.p2-btn-primary { background: #2f6df6; border-color: #2f6df6; color: #fff; font-weight: 600; text-decoration: none;
  display: inline-flex; align-items: center; }
.p2-btn-primary:hover { background: #2559d6; }
.p2-stat { display: inline-flex; gap: 6px; align-items: baseline; }
.p2-stat-k { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #79818a; }
.p2-stat-v { font-size: 13px; font-weight: 600; }
.p2-ok { color: #1a7f4b; } .p2-bad { color: #c02b2b; }

.p2-section { max-width: 1180px; margin: 28px auto 0; padding: 0 24px; }
.p2-section-wide { max-width: none; width: 100%; box-sizing: border-box; }
.p2-h2 { font-size: 20px; margin: 0 0 4px; }
.p2-lede { margin: 0 0 14px; color: #5b636b; font-size: 13px; }
.p2-h3 { font-size: 14px; font-weight: 700; margin: 0 0 10px; }

.p2-who { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
  border-radius: 4px; padding: 1px 6px; vertical-align: middle; }
.p2-who-code { background: #e3f4ea; color: #1a7f4b; }
.p2-who-llm { background: #efe6fb; color: #6b3fb5; }
.p2-who-api { background: #fdf1dc; color: #9a5b00; }

/* pipeline */
.p2-flow { list-style: none; margin: 0; padding: 0 0 8px; display: flex; flex-wrap: nowrap; align-items: stretch; }
.p2-group { position: relative; flex: 1 1 0; min-width: 0; display: flex; flex-direction: column;
  background: #fafbfc; border: 1px solid #cfd5dc; border-radius: 10px; padding: 10px 12px 12px; margin-right: 30px; }
.p2-group:last-child { margin-right: 0; }
.p2-group:not(:last-child)::after { content: "→"; position: absolute; right: -25px; top: 50%; transform: translateY(-50%);
  color: #6b7280; font-size: 20px; }
.p2-group-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.p2-group-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #2c3238; }
.p2-group-cadence { font-size: 12px; font-weight: 400; color: #6b7280; }
.p2-group-stages { display: flex; gap: 12px; align-items: stretch; flex: 1; }
.p2-group-caveat { margin-top: 8px; font-size: 11px; color: #9a5b00; background: #fdf1dc; border-radius: 6px; padding: 5px 8px; }
.p2-inner { flex: 2 1 0; min-width: 0; display: flex; flex-direction: column; border: 1px dashed #b9c3d0;
  border-radius: 8px; padding: 6px 8px 8px; }
.p2-inner-label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; color: #8b939c;
  margin-bottom: 4px; }
.p2-inner-stages { display: flex; gap: 8px; align-items: stretch; flex: 1; }
.p2-stage { position: relative; flex: 1 1 0; min-width: 140px; background: #fff; border: 1px solid #dfe3e8;
  border-radius: 8px; padding: 12px 14px 14px; cursor: default; outline: none; }
.p2-stage:hover, .p2-stage:focus-within { border-color: #b9c3d0; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.p2-stage-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 8px; }
.p2-stage-n { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px;
  border-radius: 9px; background: #2f6df6; color: #fff; font-size: 10px; font-weight: 700; flex: none; }
.p2-stage-label { font-size: 14px; font-weight: 700; line-height: 1.3; margin-bottom: 4px; }
.p2-stage-sub { font-size: 12px; font-weight: 400; color: #5b636b; line-height: 1.4; }
.p2-stage-tip { display: none; position: absolute; top: calc(100% + 8px); left: 0; z-index: 5; min-width: 280px;
  max-width: 360px; background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 10px 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,.12); font-size: 12px; white-space: normal; }
.p2-stage:hover .p2-stage-tip, .p2-stage:focus-within .p2-stage-tip { display: block; }
.p2-group:last-child .p2-stage-tip, .p2-group:nth-last-child(2) .p2-stage:last-child .p2-stage-tip { left: auto; right: 0; }
.p2-stage-where { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #8b939c;
  margin-bottom: 6px; }
.p2-stage-detail { margin: 0 0 6px; color: #2c3238; }
.p2-stage-out { margin: 0; padding-left: 16px; color: #3d444b; }
.p2-stage-out li { margin-bottom: 2px; }

/* formulae — same row + boxes as the pipeline, without arrows */
.p2-flow-static .p2-group::after { content: none; }
.p2-group-formulae { display: flex; flex-direction: column; gap: 10px; }
.p2-formula { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 10px 12px; min-width: 0; }
.p2-formula-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.p2-origin-row { display: flex; align-items: center; gap: 6px; margin: -4px 0 8px; }
.p2-origin-label { font-size: 11px; color: #5b636b; }
.p2-origin { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; text-decoration: none;
  background: #fde7ef; color: #b0234f; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
.p2-origin:hover { background: #fbd0df; }
.p2-formula-title { font-size: 13px; font-weight: 700; flex: 1; min-width: 0; }
.p2-formula-stage { font-weight: 400; color: #5b636b; }
.p2-steps { margin: 0 0 8px; padding-left: 20px; font-size: 12px; color: #2c3238; }
.p2-steps > li { margin-bottom: 8px; }
.p2-steps > li::marker { font-weight: 700; color: #2f6df6; }
.p2-tex { background: #f7f8fa; border: 1px solid #e6e9ed; border-radius: 6px; padding: 2px 10px; margin: 4px 0 0;
  overflow-x: auto; }
.p2-tex .katex-display { margin: 0.35em 0; text-align: left; }
.p2-tex .katex-display > .katex { text-align: left; }
.p2-tex .katex { font-size: 0.98em; }
.p2-formula-src { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; color: #8b939c;
  margin-bottom: 6px; word-break: break-word; }
.p2-notes { margin: 0; padding-left: 16px; font-size: 11px; color: #4b535c; }
.p2-notes li { margin-bottom: 3px; }

/* misconception cards */
.p2-card { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; margin-bottom: 10px; }
.p2-card-summary { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; cursor: pointer; padding: 12px 16px;
  list-style: none; user-select: none; }
.p2-card-summary::-webkit-details-marker { display: none; }
.p2-card-summary:hover { background: #fafbfc; }
.p2-chevron { color: #8b939c; font-size: 11px; transition: transform .12s ease; }
.p2-card[open] > .p2-card-summary > .p2-chevron { transform: rotate(90deg); }
.p2-rank, .p2-rank-inline { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 22px;
  padding: 0 6px; border-radius: 11px; background: #2f6df6; color: #fff; font-size: 12px; font-weight: 700; }
.p2-rank-inline { height: 20px; font-size: 11px; }
.p2-card-title { font-size: 15px; font-weight: 700; }
.p2-meta { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; background: #eceff3;
  color: #4b535c; border-radius: 4px; padding: 2px 7px; }
.p2-meta-template { background: #e5edff; color: #2f5bd0; text-transform: none; letter-spacing: 0; }
.p2-card-body { border-top: 1px solid #dfe3e8; padding: 12px; background: #f4f5f7; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 12px; }
.p2-block { background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 12px 14px; min-width: 0; }
.p2-block-head { display: flex; align-items: baseline; gap: 8px; margin: 0 -14px 10px; padding: 0 14px 8px;
  border-bottom: 1px solid #eef0f3; }
.p2-block-label { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #2c3238; font-weight: 700; }
.p2-block-hint { font-size: 11px; color: #8b939c; }
.p2-text { margin: 0 0 8px; font-size: 13px; }
.p2-callout { background: #f6f8fc; border-left: 3px solid #2f6df6; border-radius: 0 6px 6px 0; padding: 8px 11px;
  margin: 0 0 8px; font-size: 13px; }
.p2-row { display: grid; grid-template-columns: 150px 1fr; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f4f6f8;
  font-size: 13px; }
.p2-row-k { font-size: 11px; color: #79818a; padding-top: 2px; }
.p2-row-v { min-width: 0; word-break: break-word; }
.p2-inputs { margin-top: 8px; border: 1px solid #e6e9ed; border-radius: 6px; padding: 6px 10px 2px; }
.p2-inputs-head { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #6b3fb5; font-weight: 700;
  margin-bottom: 2px; }
.p2-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
.p2-nil { color: #a8afb6; font-style: italic; }
.p2-chips { display: inline-flex; flex-wrap: wrap; gap: 4px; }
.p2-chip { background: #eef1f4; border-radius: 4px; padding: 1px 6px; font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.p2-picks { display: grid; gap: 8px; margin-bottom: 6px; }
.p2-pick { border: 1px solid #e6e9ed; border-left: 3px solid #9aa3ad; border-radius: 6px; padding: 8px 10px; }
.p2-pick-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.p2-pick-n { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px;
  border-radius: 8px; background: #6b7280; color: #fff; font-size: 10px; font-weight: 700; }
.p2-pick-id { font-size: 13px; font-weight: 700; }
.p2-fit { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; background: #eceff3;
  color: #4b535c; border-radius: 4px; padding: 1px 6px; }
.p2-fit-strong { background: #e5edff; color: #2f5bd0; }
.p2-distinct { margin-top: 6px; font-size: 12px; color: #5b636b; }
.p2-loading { display: flex; justify-content: center; padding: 48px 0; }
`;

export default function Preview() {
  const { runs, activeId, setActiveId, status, items, manifest, loadSeq } = usePipelineRun();
  const [allOpen, setAllOpen] = useState(false);
  const [generation, setGeneration] = useState(0);

  // Collapse state belongs to the run that produced it.
  useEffect(() => {
    setAllOpen(false);
    setGeneration((g) => g + 1);
  }, [loadSeq]);

  const setAll = (open: boolean) => {
    setAllOpen(open);
    setGeneration((g) => g + 1);
  };

  const shown = useMemo(() => {
    const rank = (m: Rec) => (typeof m.priorityRank === 'number' ? m.priorityRank : Number.POSITIVE_INFINITY);
    return [...items].sort((a, b) => rank(a) - rank(b));
  }, [items]);

  const models = Array.isArray(manifest.models) ? asStrings(manifest.models) : [];

  return (
    <div className="p2-wrap">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <RunBar
        runs={runs}
        activeId={activeId}
        status={status}
        manifest={manifest}
        count={items.length}
        onSelectRun={setActiveId}
        onExpandAll={() => setAll(true)}
        onCollapseAll={() => setAll(false)}
      />

      <PipelineFlow models={models} />
      <Formulae />

      <section className="p2-section p2-section-wide">
        <h2 className="p2-h2">Example Run — Wave 1 Class with No Exemplars</h2>
        <p className="p2-lede">
          One real pass of the pipeline above over a Wave 1 classroom&apos;s quiz, with no exemplar text supplied.
          Expand a card to see what each step produced for that misconception.
        </p>
        <h3 className="p2-h3">Misconceptions:</h3>
        {status === 'loading' && (
          <div className="p2-loading">
            <CircularProgress />
          </div>
        )}
        {status === 'empty' && (
          <p className="p2-note">
            No runs published yet — run <code>yarn seed:eval --session &lt;id&gt;</code> and refresh.
          </p>
        )}
        {status !== 'loading' &&
          shown.map((item, i) => (
            <MisconceptionCard
              key={`${activeId}-${asStr(item.id) || `m-${i}`}`}
              item={item}
              index={i}
              open={allOpen}
              generation={generation}
            />
          ))}
      </section>
    </div>
  );
}
