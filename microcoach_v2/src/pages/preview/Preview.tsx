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
                <details className="p2-formula" key={f.id}>
                  <summary className="p2-formula-head">
                    <span className="p2-chevron" aria-hidden="true">
                      ▸
                    </span>
                    {hit && <span className="p2-stage-n">{hit.n}</span>}
                    <span className="p2-formula-title">
                      {hit && <span className="p2-formula-stage">{hit.stage.label} · </span>}
                      {f.title}
                    </span>
                    <WhoBadge who={f.who} />
                    {f.origin && <OriginTag origin={f.origin} />}
                  </summary>
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
                </details>
              );
            }),
          );
          // Boxes with nothing to compute (fetch-only, under construction) are left out.
          if (cards.length === 0) return null;
          return (
            <li className="p2-group" key={g.id}>
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

// The Wave 2 Misconception Rubric scorecard as the run recorded it — read from
// the item, not recomputed here.
const RUBRIC_LABELS: Record<string, string> = {
  frequency: 'frequency',
  learningProgressionInfluence: 'progression influence',
  studentConfidence: 'student confidence',
  lcMisconceptionEvalScore: 'LC evaluator',
  conceptualDepth: 'conceptual depth',
};

// How a tie on the rubric total is broken, in order. Copied from
// microcoachv2ScoresCalc/src/misconceptionRubric.json → selection.tiebreak; the
// values compared are on each item's rubric.inputs.
const TIEBREAK: Array<{ key: string; label: string; fmt: (v: unknown) => string }> = [
  { key: 'conceptualDepth', label: 'conceptual depth', fmt: (v) => String(v) },
  { key: 'studentPercent', label: 'share of class', fmt: (v) => pct(v) || String(v) },
  { key: 'meanConfidence', label: 'mean confidence', fmt: (v) => String(v) },
];

interface TieNote {
  withRank: number | null;
  decidedBy: string;
  detail: string | null;
}

// For each card that shares its normalized rubric score with the card ranked
// just above it, say which tiebreak separated them. Keyed by position in the
// ranked list; the note goes on the lower-ranked card, since that is the rank
// that needs explaining.
function findTies(ranked: Rec[]): Map<number, TieNote> {
  const ties = new Map<number, TieNote>();
  ranked.forEach((item, i) => {
    if (i === 0) return;
    const a = asRec(ranked[i - 1].rubric);
    const b = asRec(item.rubric);
    if (!a || !b || typeof a.normalized !== 'number' || a.normalized !== b.normalized) return;
    const ai = asRec(a.inputs) ?? {};
    const bi = asRec(b.inputs) ?? {};
    const withRank = typeof ranked[i - 1].priorityRank === 'number' ? (ranked[i - 1].priorityRank as number) : null;
    const decider = TIEBREAK.find((t) => ai[t.key] !== bi[t.key]);
    if (decider) {
      ties.set(i, {
        withRank,
        decidedBy: decider.label,
        detail: `${decider.fmt(bi[decider.key])} vs ${decider.fmt(ai[decider.key])}`,
      });
    } else {
      ties.set(i, { withRank, decidedBy: 'the order the model listed them', detail: null });
    }
  });
  return ties;
}

function TieTag({ tie }: { tie: TieNote | undefined }) {
  if (!tie) return null;
  return (
    <span className="p2-meta p2-tie" title="same rubric total as the card above; the tiebreak decided the order">
      Tied with #{tie.withRank ?? '?'} · ranked lower on {tie.decidedBy}
      {tie.detail && ` (${tie.detail})`}
    </span>
  );
}

// The rubric total for a card header: the reason the rank is what it is, read
// left to right from the rank chip. The per-metric breakdown is in the body.
function ScoreStrip({ item }: { item: Rec }) {
  const rubric = asRec(item.rubric);
  if (!rubric || typeof rubric.total !== 'number' || typeof rubric.maxPossible !== 'number') return null;
  return (
    <span className="p2-meta p2-meta-scores" title="misconception rubric total">
      <span className="p2-mono p2-score-total">
        {rubric.total}/{rubric.maxPossible}
      </span>
    </span>
  );
}

function RubricBlock({ item, tie }: { item: Rec; tie?: TieNote }) {
  const rubric = asRec(item.rubric);
  if (!rubric) {
    return (
      <Block label="Rubric" hint="ScoresCalc">
        <span className="p2-nil">not scored on this run</span>
      </Block>
    );
  }
  const scores = asRec(rubric.scores) ?? {};
  const missing = asStrings(rubric.missing);
  const total = typeof rubric.total === 'number' ? rubric.total : null;
  const max = typeof rubric.maxPossible === 'number' ? rubric.maxPossible : null;
  const retained = item.retained !== false;
  return (
    <Block label="Rubric" hint={`ScoresCalc · ${asStr(rubric.version) || 'misconceptionRubric.json'}`}>
      <div className="p2-inputs">
        <div className="p2-inputs-head">Misconception rubric</div>
        {Object.entries(scores).map(([k, v]) => {
          let cell = `${String(v)} / 3`;
          if (v == null) cell = missing.includes(k) ? 'not measured' : '—';
          return <Row key={k} k={RUBRIC_LABELS[k] ?? k} v={<span className="p2-mono">{cell}</span>} />;
        })}
        <Row
          k="→ total"
          v={
            <span>
              <span className="p2-mono">{total == null || max == null ? '—' : `${total} / ${max}`}</span>
              {' · '}
              <span className="p2-rank-inline">#{String(item.priorityRank ?? '—')}</span>
              {item.isRecommendedFocus === true && <span className="p2-focus"> Recommended Focus</span>}
              {!retained && <span className="p2-dropped"> dropped by cap</span>}
            </span>
          }
        />
        {tie && <Row k="tie" v={<TieTag tie={tie} />} />}
        {asStr(rubric.conceptualDepthWhy) !== '' && (
          <Row k="depth — why" v={<MathText text={asStr(rubric.conceptualDepthWhy)} />} />
        )}
      </div>
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
    <Block label="Instructional need" hint="LLMGenInstrNeed · need + rationale">
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
          <div className="p2-inputs-head">Rationale</div>
          <Row k="prevalence" v={<span>{asStr(r.prevalence) || '—'}</span>} />
          <Row k="confidence signal" v={<span>{asStr(r.confidenceSignal) || '—'}</span>} />
          <Row k="prerequisite gaps" v={<Chips items={asStrings(r.prerequisiteGaps)} />} />
          <Row k="forward impact" v={<Chips items={asStrings(r.forwardImpact)} />} />
          <Row k="recurrence" v={<span>{asStr(r.recurrence) || '—'}</span>} />
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
                <span className={typeof pick.instructionalFit === 'number' && pick.instructionalFit >= 2 ? 'p2-fit p2-fit-strong' : 'p2-fit'}>
                  {typeof pick.instructionalFit === 'number' ? `fit ${pick.instructionalFit}/3` : asStr(pick.fit) || '?'}
                </span>
                {pick.belowThreshold === true && <span className="p2-fit p2-fit-below">below threshold</span>}
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
  tie,
}: {
  item: Rec;
  index: number;
  open: boolean;
  generation: number;
  tie?: TieNote;
}) {
  const rank = typeof item.priorityRank === 'number' ? item.priorityRank : index + 1;
  return (
    // Remounted on `generation` so Expand/Collapse all re-applies the default:
    // <details open> is uncontrolled after first render.
    <details className={item.retained === false ? 'p2-card p2-card-dropped' : 'p2-card'} key={generation} open={open}>
      <summary className="p2-card-summary">
        <span className="p2-chevron" aria-hidden="true">
          ▸
        </span>
        <span className={item.isRecommendedFocus === true ? 'p2-rank p2-rank-focus' : 'p2-rank'}>#{rank}</span>
        <span className="p2-card-title">{asStr(item.title) || '(untitled)'}</span>
        {item.isRecommendedFocus === true && <span className="p2-meta p2-focus">Recommended Focus</span>}
        <ScoreStrip item={item} />
        <TieTag tie={tie} />
      </summary>
      <div className="p2-card-body">
        <MisconceptionBlock item={item} />
        <RubricBlock item={item} tie={tie} />
        <NeedBlock item={item} />
        <TemplateBlock item={item} />
      </div>
    </details>
  );
}

// ── Run bar ───────────────────────────────────────────────────────────────────

// One line from input scale to output totals. Stage ratios are fixed (1 need and
// 2 templates per misconception), so totals read better than completion ratios;
// a shortfall is called out separately. Segments whose counts an older run's
// manifest lacks are left out rather than shown as dashes.
function flowLine(manifest: Rec, misconceptionCount: number): string {
  const num = (k: string): number | null => (typeof manifest[k] === 'number' ? (manifest[k] as number) : null);
  const input = [
    num('questionCount') !== null && `${num('questionCount')} questions`,
    num('distractorCount') !== null && `${num('distractorCount')} distractors`,
    num('studentCount') !== null && `${num('studentCount')} students`,
  ].filter(Boolean);
  const mis = num('misconceptionCount') ?? misconceptionCount;
  const needs = num('instructionalNeedsGenerated');
  const picks = num('templatePicks') ?? (num('templatesSelected') !== null ? (num('templatesSelected') as number) * 2 : null);
  const stages = [
    `${mis} misconceptions`,
    needs !== null && `${needs} instructional needs (1 each)`,
    picks !== null && `${picks} activity templates (2 each)`,
  ].filter(Boolean);
  return [input.join(' · '), ...stages].filter((s) => s !== '').join('  →  ');
}

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
  const missing = asArray(manifest.instructionalNeedsMissing);
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
        <span className="p2-flowline">{flowLine(manifest, count)}</span>
      </div>
      {missing.length > 0 && (
        <div className="p2-bar-row p2-bad p2-note">
          {`No instructional need was returned for ${missing.length === 1 ? 'one misconception' : `${missing.length} misconceptions`}: ${missing.map((m) => asStr(m.title)).join('; ')}`}
        </div>
      )}
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
.p2-flowline { font-size: 13px; font-weight: 600; }
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
.p2-stage { position: relative; flex: 1 1 0; min-width: 0; background: #fff; border: 1px solid #dfe3e8;
  border-radius: 8px; padding: 12px 14px 14px; cursor: default; outline: none; }
.p2-stage:hover, .p2-stage:focus-within { border-color: #b9c3d0; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.p2-stage-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 8px; }
.p2-stage-n { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px;
  border-radius: 9px; background: #2f6df6; color: #fff; font-size: 10px; font-weight: 700; flex: none; }
.p2-stage-label { font-size: 14px; font-weight: 700; line-height: 1.3; margin-bottom: 4px; overflow-wrap: anywhere; hyphens: auto; }
.p2-stage-sub { font-size: 12px; font-weight: 400; color: #5b636b; line-height: 1.4; overflow-wrap: anywhere; }
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
.p2-formula-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 0; cursor: pointer; list-style: none; }
.p2-formula-head::-webkit-details-marker { display: none; }
.p2-formula[open] > .p2-formula-head { margin-bottom: 8px; }
.p2-formula[open] > .p2-formula-head > .p2-chevron { transform: rotate(90deg); }
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
/* Past the rubric cap: scored and ranked, but not carried into needs or activities. */
.p2-card-dropped > .p2-card-summary { background: #f3f4f6; color: #5b636b; }
.p2-card-dropped > .p2-card-summary:hover { background: #eceef1; }
.p2-card-dropped > .p2-card-summary .p2-rank { background: #d5d9df; color: #4b525a; }
.p2-chevron { color: #8b939c; font-size: 11px; transition: transform .12s ease; }
.p2-card[open] > .p2-card-summary > .p2-chevron { transform: rotate(90deg); }
.p2-rank, .p2-rank-inline { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 22px;
  padding: 0 6px; border-radius: 11px; background: #2f6df6; color: #fff; font-size: 12px; font-weight: 700; }
.p2-rank-inline { height: 20px; font-size: 11px; }
.p2-card-title { font-size: 15px; font-weight: 700; }
.p2-meta { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; background: #eceff3;
  color: #4b535c; border-radius: 4px; padding: 2px 7px; }
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
.p2-fit-below { background: #fdecec; color: #b3261e; margin-left: 4px; }
.p2-meta-scores { display: inline-flex; gap: 4px; align-items: center; }
.p2-tie { font-size: 11px; color: #9a5b00; background: #fdf1dc; border-radius: 6px; padding: 2px 7px; }
.p2-score-total { font-weight: 700; color: #2c3238; }

.p2-focus { color: #1f7a3a; font-weight: 700; }
.p2-dropped { color: #8a8f98; font-style: italic; }
.p2-rank-focus { background: #1f7a3a; color: #fff; }
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
  const ties = useMemo(() => findTies(shown), [shown]);

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
              tie={ties.get(i)}
            />
          ))}
      </section>
    </div>
  );
}
