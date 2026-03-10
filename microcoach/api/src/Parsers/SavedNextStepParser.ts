import { isNullOrUndefined } from './global'
import { IMisconceptionEvidence, MisconceptionEvidenceParser } from './MisconceptionEvidenceParser'
import { ITabs, TabsParser } from './TabsParser'
import { ICCSSStandards } from './GapGroupParser'

// ── Interfaces ────────────────────────────────────────────────────────────────

/**
 * The shape of a SavedNextStep as used in React state and UI components.
 * Timestamps are milliseconds (number), complex fields are parsed objects.
 */
export interface ILocalSavedNextStep {
  id:                      string
  createdAt:               number
  completedAt:             number | undefined
  status:                  'planned' | 'completed'
  gapGroupId:              string
  gapGroupTitle:           string
  targetObjectiveStandard: string | undefined
  priority:                string
  studentCount:            number | null
  studentPercent:          number | null
  occurrence:              string
  misconceptionSummary:    string
  successIndicators:       string[]
  ccssStandards:           ICCSSStandards | undefined
  gaps:                    string[]
  moveId:                  string
  moveTitle:               string
  moveTime:                string
  moveFormat:              string
  moveSummary:             string
  aiReasoning:             string
  evidence:                IMisconceptionEvidence | null
  move: {
    id:          string
    title:       string
    time:        string
    format:      string
    summary:     string
    aiReasoning: string
    tabs:        ITabs | null
  }
}

/**
 * The shape of a SavedNextStep as returned from the GraphQL API / DynamoDB.
 * Timestamps are ISO strings, evidence and tabs are AWSJSON (string or already-parsed object).
 */
export interface IDBSavedNextStep {
  id:                      string
  classroomId:             string
  sessionId:               string | null
  activityId:              string | null
  status:                  string
  createdAt:               string
  completedAt:             string | null
  sortOrder:               number | null
  misconceptionId:         string
  misconceptionTitle:      string
  targetObjectiveStandard: string | null
  priority:                string
  studentCount:            number | null
  studentPercent:          number | null
  occurrence:              string | null
  misconceptionSummary:    string | null
  successIndicators:       string[]
  activityTitle:           string
  activityTime:            string
  activityFormat:          string
  activitySummary:         string
  aiReasoning:             string | null
  // AWSJSON fields — may arrive as string or pre-parsed object from AppSync
  evidence:                unknown
  tabs:                    unknown
}

/**
 * The input shape for createSavedNextStep / updateSavedNextStep mutations.
 * evidence and tabs must be JSON strings (AWSJSON scalars).
 */
export interface ISavedNextStepMutationInput {
  id:                      string
  classroomId:             string
  status:                  string
  misconceptionId:         string
  misconceptionTitle:      string
  targetObjectiveStandard: string | undefined
  priority:                string
  studentCount:            number | null
  studentPercent:          number | null
  occurrence:              string
  misconceptionSummary:    string
  successIndicators:       string[]
  activityId:              string
  activityTitle:           string
  activityTime:            string
  activityFormat:          string
  activitySummary:         string
  aiReasoning:             string
  evidence:                string | null
  tabs:                    string | null
}

// ── Parser ────────────────────────────────────────────────────────────────────

export class SavedNextStepParser {
  /**
   * Convert a raw DB/API record to the local UI shape.
   * Throws if required fields (id) are missing.
   */
  static dbToLocal(db: IDBSavedNextStep): ILocalSavedNextStep {
    if (isNullOrUndefined(db)) {
      throw new Error('SavedNextStepParser.dbToLocal: input cannot be null')
    }
    if (isNullOrUndefined(db.id)) {
      throw new Error("SavedNextStep has null field for 'id' which is required")
    }

    const evidence = MisconceptionEvidenceParser.fromRaw(db.evidence)
    const tabs     = TabsParser.fromRaw(db.tabs)

    const ccssStandards: ICCSSStandards | undefined = db.targetObjectiveStandard
      ? {
          targetObjective:    { standard: db.targetObjectiveStandard, description: '' },
          prerequisiteGaps:   [],
          impactedObjectives: [],
        }
      : undefined

    return {
      id:          db.id,
      createdAt:   db.createdAt ? new Date(db.createdAt).getTime() : Date.now(),
      completedAt: db.completedAt ? new Date(db.completedAt).getTime() : undefined,
      status:      (db.status === 'completed' ? 'completed' : 'planned'),
      gapGroupId:    db.misconceptionId  ?? '',
      gapGroupTitle: db.misconceptionTitle ?? '',
      targetObjectiveStandard: db.targetObjectiveStandard ?? undefined,
      priority:              db.priority ?? 'Low',
      studentCount:          db.studentCount  ?? null,
      studentPercent:        db.studentPercent ?? null,
      occurrence:            db.occurrence ?? '',
      misconceptionSummary:  db.misconceptionSummary ?? '',
      successIndicators:     Array.isArray(db.successIndicators) ? db.successIndicators : [],
      ccssStandards,
      gaps: db.targetObjectiveStandard ? [db.targetObjectiveStandard] : [],
      moveId:      db.activityId ?? '',
      moveTitle:   db.activityTitle ?? '',
      moveTime:    db.activityTime ?? '',
      moveFormat:  db.activityFormat ?? '',
      moveSummary: db.activitySummary ?? '',
      aiReasoning: db.aiReasoning ?? '',
      evidence,
      move: {
        id:          db.activityId     ?? '',
        title:       db.activityTitle  ?? '',
        time:        db.activityTime   ?? '',
        format:      db.activityFormat ?? '',
        summary:     db.activitySummary ?? '',
        aiReasoning: db.aiReasoning     ?? '',
        tabs,
      },
    }
  }

  static mapDbToLocal(items: IDBSavedNextStep[]): ILocalSavedNextStep[] {
    if (!Array.isArray(items)) return []
    return items
      .map((item, i) => {
        try {
          return this.dbToLocal(item)
        } catch (err) {
          console.warn(`SavedNextStepParser: skipping item[${i}] — ${err}`)
          return null
        }
      })
      .filter((x): x is ILocalSavedNextStep => x !== null)
  }

  /**
   * Build the mutation input from a local item + a gap group move.
   * Serializes evidence and tabs to JSON strings for AWSJSON fields.
   */
  static toMutationInput(
    classroomId: string,
    local: ILocalSavedNextStep,
  ): ISavedNextStepMutationInput {
    return {
      id:                      local.id,
      classroomId,
      status:                  local.status,
      misconceptionId:         local.gapGroupId,
      misconceptionTitle:      local.gapGroupTitle,
      targetObjectiveStandard: local.targetObjectiveStandard,
      priority:                local.priority ?? 'Low',
      studentCount:            local.studentCount  ?? null,
      studentPercent:          local.studentPercent ?? null,
      occurrence:              local.occurrence ?? '',
      misconceptionSummary:    local.misconceptionSummary ?? '',
      successIndicators:       local.successIndicators ?? [],
      activityId:              local.moveId,
      activityTitle:           local.moveTitle,
      activityTime:            local.moveTime,
      activityFormat:          local.moveFormat,
      activitySummary:         local.moveSummary,
      aiReasoning:             local.aiReasoning ?? '',
      evidence:                MisconceptionEvidenceParser.toAwsJson(local.evidence),
      tabs:                    TabsParser.toAwsJson(local.move?.tabs ?? null),
    }
  }
}
