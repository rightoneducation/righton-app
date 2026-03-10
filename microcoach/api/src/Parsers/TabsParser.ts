import { isNullOrUndefined } from './global'

// ── Interfaces ────────────────────────────────────────────────────────────────

/**
 * The schema defines Overview.whatStudentsDo / whatYouDo as String, but at
 * runtime the LLM outputs arrays of {label, detail} bullet objects.
 * Both shapes are represented here; consumers should handle either.
 */
export interface IOverviewBullet {
  label: string
  detail: string
}

export interface IOverview {
  whatStudentsDo: string | IOverviewBullet[]
  whatYouDo:      string | IOverviewBullet[]
  importance:     string
}

export interface IIncorrectWorkedExample {
  problem:       string
  incorrectWork: string
}

export interface IActivitySteps {
  setup:                   string[]
  problem:                 string
  coreActivity:            string[]
  discussionQuestions:     string[]
  incorrectWorkedExamples: IIncorrectWorkedExample[]
}

export interface IMaterials {
  required: string[]
  optional: string[]
}

export interface IStudentGroup {
  name:        string
  description: string
  students:    string[]
}

export interface IHighFlyers {
  students:    string[]
  description: string
}

export interface IStudentGroupings {
  groups:            IStudentGroup[]
  highFlyers:        IHighFlyers | null
  aiRecommendation:  string
}

export interface ITabs {
  overview:         IOverview | null
  activitySteps:    IActivitySteps | null
  materials:        IMaterials | null
  studentGroupings: IStudentGroupings | null
}

// ── Parser ────────────────────────────────────────────────────────────────────

export class TabsParser {
  /**
   * Parse a raw tabs value (object or JSON string) from pregeneratedNextSteps
   * or a DB AWSJSON field. Returns null if input is null/undefined.
   */
  static fromRaw(raw: unknown): ITabs | null {
    if (isNullOrUndefined(raw)) return null

    let obj: Record<string, unknown>
    if (typeof raw === 'string') {
      try {
        obj = JSON.parse(raw)
      } catch {
        return null
      }
    } else if (typeof raw === 'object' && !Array.isArray(raw)) {
      obj = raw as Record<string, unknown>
    } else {
      return null
    }

    return {
      overview:         this.parseOverview(obj.overview),
      activitySteps:    this.parseActivitySteps(obj.activitySteps),
      materials:        this.parseMaterials(obj.materials),
      studentGroupings: this.parseStudentGroupings(obj.studentGroupings),
    }
  }

  private static parseOverview(raw: unknown): IOverview | null {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return null
    const obj = raw as Record<string, unknown>
    return {
      whatStudentsDo: this.parseBulletField(obj.whatStudentsDo),
      whatYouDo:      this.parseBulletField(obj.whatYouDo),
      importance:     typeof obj.importance === 'string' ? obj.importance : '',
    }
  }

  /**
   * whatStudentsDo / whatYouDo may be a plain String or an array of
   * {label, detail} objects depending on which LLM output path created them.
   */
  private static parseBulletField(raw: unknown): string | IOverviewBullet[] {
    if (typeof raw === 'string') return raw
    if (Array.isArray(raw)) {
      return raw
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const o = item as Record<string, unknown>
          return {
            label:  typeof o.label  === 'string' ? o.label  : '',
            detail: typeof o.detail === 'string' ? o.detail : '',
          }
        })
    }
    return ''
  }

  private static parseActivitySteps(raw: unknown): IActivitySteps | null {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return null
    const obj = raw as Record<string, unknown>
    return {
      setup:                   this.parseStringArray(obj.setup),
      problem:                 typeof obj.problem === 'string' ? obj.problem : '',
      coreActivity:            this.parseStringArray(obj.coreActivity),
      discussionQuestions:     this.parseStringArray(obj.discussionQuestions),
      incorrectWorkedExamples: this.parseWorkedExamples(obj.incorrectWorkedExamples),
    }
  }

  private static parseMaterials(raw: unknown): IMaterials | null {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return null
    const obj = raw as Record<string, unknown>
    return {
      required: this.parseStringArray(obj.required),
      optional: this.parseStringArray(obj.optional),
    }
  }

  private static parseStudentGroupings(raw: unknown): IStudentGroupings | null {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return null
    const obj = raw as Record<string, unknown>
    return {
      groups:           this.parseStudentGroups(obj.groups),
      highFlyers:       this.parseHighFlyers(obj.highFlyers),
      aiRecommendation: typeof obj.aiRecommendation === 'string' ? obj.aiRecommendation : '',
    }
  }

  private static parseStudentGroups(raw: unknown): IStudentGroup[] {
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const o = item as Record<string, unknown>
        return {
          name:        typeof o.name        === 'string' ? o.name        : '',
          description: typeof o.description === 'string' ? o.description : '',
          students:    this.parseStringArray(o.students),
        }
      })
  }

  private static parseHighFlyers(raw: unknown): IHighFlyers | null {
    if (isNullOrUndefined(raw) || typeof raw !== 'object' || Array.isArray(raw)) return null
    const obj = raw as Record<string, unknown>
    return {
      students:    this.parseStringArray(obj.students),
      description: typeof obj.description === 'string' ? obj.description : '',
    }
  }

  private static parseWorkedExamples(raw: unknown): IIncorrectWorkedExample[] {
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const o = item as Record<string, unknown>
        return {
          problem:       typeof o.problem       === 'string' ? o.problem       : '',
          incorrectWork: typeof o.incorrectWork === 'string' ? o.incorrectWork : '',
        }
      })
  }

  private static parseStringArray(raw: unknown): string[] {
    if (!Array.isArray(raw)) return []
    return raw.filter((s) => typeof s === 'string') as string[]
  }

  /**
   * Serialize a tabs object to a JSON string for an AWSJSON field.
   * Ensures no undefined values slip through.
   */
  static toAwsJson(tabs: ITabs | null | undefined): string | null {
    if (isNullOrUndefined(tabs)) return null
    return JSON.stringify(tabs, (_, v) => (v === undefined ? null : v))
  }
}
