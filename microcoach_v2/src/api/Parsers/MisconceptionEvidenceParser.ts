import { isNullOrUndefined } from './global'

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface IMisconceptionEvidence {
  source: string
  mostCommonError: string
  sampleStudentWork: string[]
  aiThinkingPattern: string
}

// ── Parser ────────────────────────────────────────────────────────────────────

export class MisconceptionEvidenceParser {
  /**
   * Parse a raw evidence object (from pregeneratedNextSteps JSON or a DB record).
   * All fields are optional — returns null if input is null/undefined.
   */
  static fromRaw(raw: unknown): IMisconceptionEvidence | null {
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

    const sampleStudentWork = Array.isArray(obj.sampleStudentWork)
      ? (obj.sampleStudentWork as unknown[])
          .filter((s) => typeof s === 'string')
          .map((s) => s as string)
      : []

    return {
      source:            typeof obj.source            === 'string' ? obj.source            : '',
      mostCommonError:   typeof obj.mostCommonError   === 'string' ? obj.mostCommonError   : '',
      sampleStudentWork,
      aiThinkingPattern: typeof obj.aiThinkingPattern === 'string' ? obj.aiThinkingPattern : '',
    }
  }

  /**
   * Serialize evidence to a JSON string suitable for an AWSJSON field.
   * Returns null if input is null/undefined.
   */
  static toAwsJson(evidence: IMisconceptionEvidence | null | undefined): string | null {
    if (isNullOrUndefined(evidence)) return null
    return JSON.stringify({
      source:            evidence.source            ?? '',
      mostCommonError:   evidence.mostCommonError   ?? '',
      sampleStudentWork: evidence.sampleStudentWork ?? [],
      aiThinkingPattern: evidence.aiThinkingPattern ?? '',
    })
  }

  static mapFromRawArray(
    items: unknown[]
  ): Array<IMisconceptionEvidence | null> {
    if (!Array.isArray(items)) return []
    return items.map((item) => this.fromRaw(item))
  }
}
