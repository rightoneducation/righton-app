import { isNullOrUndefined } from './global'
import { IMisconceptionEvidence, MisconceptionEvidenceParser } from './MisconceptionEvidenceParser'
import { ITabs, TabsParser } from './TabsParser'

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ICCSSStandard {
  standard:          string
  description:       string
  learningComponents: string[]
}

export interface ICCSSStandards {
  targetObjective:    ICCSSStandard
  prerequisiteGaps:   ICCSSStandard[]
  impactedObjectives: ICCSSStandard[]
}

export interface IQuestionErrorRate {
  label:     string
  errorRate: number
}

export interface IStudentGroups {
  buildingUnderstanding: string[]
  understoodConcept:     string[]
}

export interface IWrongAnswerExplanation {
  answer:      string
  explanation: string
}

export interface IActivityMove {
  id:               string
  title:            string
  time:             string
  format:           string
  summary:          string
  targets:          string | null
  instructionalMove: string | null
  strategyTag:      string | null
  aiReasoning:      string
  tabs:             ITabs | null
}

/**
 * A gap group entry from pregeneratedNextSteps — the precomputed shape
 * written by generate-next-steps.ts and stored on Session.pregeneratedNextSteps.
 */
export interface IGapGroup {
  id:                      string
  title:                   string
  frequency:               string | null
  isCore:                  boolean
  occurrence:              string
  example:                 string | null
  misconceptionSummary:    string
  aiReasoning:             string | null
  successIndicators:       string[]
  ccssStandards:           ICCSSStandards
  evidence:                IMisconceptionEvidence | null
  questionErrorRates:      IQuestionErrorRate[]
  ppqQuestions:            unknown[]
  studentGroups:           IStudentGroups
  wrongAnswerExplanations: IWrongAnswerExplanation[]
  correctAnswerSolution:   string[]
  priority:                string
  studentCount:            number | null
  studentPercent:          number | null
  moveOptions:             IActivityMove[]
}

// ── Parser ────────────────────────────────────────────────────────────────────

export class GapGroupParser {
  /**
   * Parse one gap group entry from a pregeneratedNextSteps array element.
   * Throws if the required `id` or `title` fields are missing.
   */
  static fromRaw(raw: unknown): IGapGroup {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error('GapGroupParser.fromRaw: input must be a non-null object')
    }
    const obj = raw as Record<string, unknown>

    if (isNullOrUndefined(obj.id)) {
      throw new Error("GapGroup has null field for 'id' which is required")
    }

    const id    = obj.id    as string
    const title = typeof obj.title === 'string' ? obj.title : ''

    return {
      id,
      title,
      frequency:            typeof obj.frequency === 'string' ? obj.frequency : null,
      isCore:               typeof obj.isCore    === 'boolean' ? obj.isCore : false,
      occurrence:           typeof obj.occurrence === 'string' ? obj.occurrence : '',
      example:              typeof obj.example   === 'string' ? obj.example : null,
      misconceptionSummary: typeof obj.misconceptionSummary === 'string' ? obj.misconceptionSummary : '',
      aiReasoning:          typeof obj.aiReasoning === 'string' ? obj.aiReasoning : null,
      successIndicators:    this.parseStringArray(obj.successIndicators),
      ccssStandards:        this.parseCCSSStandards(obj.ccssStandards),
      evidence:             MisconceptionEvidenceParser.fromRaw(obj.evidence),
      questionErrorRates:   this.parseQuestionErrorRates(obj.questionErrorRates),
      ppqQuestions:         Array.isArray(obj.ppqQuestions) ? obj.ppqQuestions : [],
      studentGroups:        this.parseStudentGroups(obj.studentGroups),
      wrongAnswerExplanations: this.parseWrongAnswerExplanations(obj.wrongAnswerExplanations),
      correctAnswerSolution:  this.parseStringArray(obj.correctAnswerSolution),
      priority:             typeof obj.priority === 'string' ? obj.priority : 'Low',
      studentCount:         typeof obj.studentCount  === 'number' ? obj.studentCount  : null,
      studentPercent:       typeof obj.studentPercent === 'number' ? obj.studentPercent : null,
      moveOptions:          this.parseMoveOptions(obj.moveOptions, obj.move),
    }
  }

  /**
   * Parse a pregeneratedNextSteps JSON string or array.
   * Returns an empty array if parsing fails.
   */
  static fromPregeneratedJson(raw: unknown): IGapGroup[] {
    let arr: unknown[]
    if (typeof raw === 'string') {
      try {
        arr = JSON.parse(raw)
      } catch {
        return []
      }
    } else if (Array.isArray(raw)) {
      arr = raw
    } else {
      return []
    }

    return arr
      .map((item, i) => {
        try {
          return this.fromRaw(item)
        } catch (err) {
          console.warn(`GapGroupParser: skipping item[${i}] — ${err}`)
          return null
        }
      })
      .filter((g): g is IGapGroup => g !== null)
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private static parseCCSSStandards(raw: unknown): ICCSSStandards {
    const empty: ICCSSStandards = {
      targetObjective:    { standard: '', description: '', learningComponents: [] },
      prerequisiteGaps:   [],
      impactedObjectives: [],
    }
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return empty
    const obj = raw as Record<string, unknown>

    const parseStandard = (s: unknown): ICCSSStandard => {
      if (isNullOrUndefined(s) || typeof s !== 'object' || Array.isArray(s)) {
        return { standard: '', description: '', learningComponents: [] }
      }
      const o = s as Record<string, unknown>
      return {
        standard:           typeof o.standard    === 'string' ? o.standard    : '',
        description:        typeof o.description === 'string' ? o.description : '',
        learningComponents: Array.isArray(o.learningComponents)
          ? (o.learningComponents as unknown[]).filter((c): c is string => typeof c === 'string')
          : [],
      }
    }

    const parseStandardArray = (a: unknown): ICCSSStandard[] =>
      Array.isArray(a) ? a.map(parseStandard) : []

    return {
      targetObjective:    parseStandard(obj.targetObjective),
      prerequisiteGaps:   parseStandardArray(obj.prerequisiteGaps),
      impactedObjectives: parseStandardArray(obj.impactedObjectives),
    }
  }

  private static parseQuestionErrorRates(raw: unknown): IQuestionErrorRate[] {
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const o = item as Record<string, unknown>
        return {
          label:     typeof o.label     === 'string' ? o.label     : '',
          errorRate: typeof o.errorRate === 'number' ? o.errorRate : 0,
        }
      })
  }

  private static parseStudentGroups(raw: unknown): IStudentGroups {
    const empty: IStudentGroups = { buildingUnderstanding: [], understoodConcept: [] }
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return empty
    const obj = raw as Record<string, unknown>
    return {
      buildingUnderstanding: this.parseStringArray(obj.buildingUnderstanding),
      understoodConcept:     this.parseStringArray(obj.understoodConcept),
    }
  }

  private static parseWrongAnswerExplanations(raw: unknown): IWrongAnswerExplanation[] {
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const o = item as Record<string, unknown>
        return {
          answer:      typeof o.answer      === 'string' ? o.answer      : '',
          explanation: typeof o.explanation === 'string' ? o.explanation : '',
        }
      })
  }

  /**
   * moveOptions is the primary field; legacy data may use a single `move` field.
   */
  private static parseMoveOptions(
    moveOptionsRaw: unknown,
    moveFallbackRaw: unknown,
  ): IActivityMove[] {
    const source = Array.isArray(moveOptionsRaw) && moveOptionsRaw.length > 0
      ? moveOptionsRaw
      : (!isNullOrUndefined(moveFallbackRaw) ? [moveFallbackRaw] : [])

    return source
      .filter((item) => item && typeof item === 'object')
      .map((item) => this.parseActivityMove(item as Record<string, unknown>))
  }

  private static parseActivityMove(obj: Record<string, unknown>): IActivityMove {
    return {
      id:               typeof obj.id      === 'string' ? obj.id      : '',
      title:            typeof obj.title   === 'string' ? obj.title   : '',
      time:             typeof obj.time    === 'string' ? obj.time    : '',
      format:           typeof obj.format  === 'string' ? obj.format  : '',
      summary:          typeof obj.summary === 'string' ? obj.summary : '',
      targets:          typeof obj.targets          === 'string' ? obj.targets          : null,
      instructionalMove: typeof obj.instructionalMove === 'string' ? obj.instructionalMove : null,
      strategyTag:      typeof obj.strategyTag      === 'string' ? obj.strategyTag      : null,
      aiReasoning:      typeof obj.aiReasoning === 'string' ? obj.aiReasoning : '',
      tabs:             TabsParser.fromRaw(obj.tabs),
    }
  }

  private static parseStringArray(raw: unknown): string[] {
    if (!Array.isArray(raw)) return []
    return raw.filter((s) => typeof s === 'string') as string[]
  }
}
