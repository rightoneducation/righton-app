# How We Calculate Post-Quiz Improvement
---

## What the Number Means

After a teacher runs an intervention activity, students take a follow-up quiz. The **"+X% class mastery"** number on the Reflect tab shows how much the class improved on a specific misconception — comparing who was struggling *before* the intervention to who is still struggling *after*.

---

## Where "Before" Comes From

When a teacher looks at an activity on the Prepare tab, they see students sorted into groups: **Group A: Needs Concrete Repair**, **Group B: Partial Understanding**, and **Group C: Ready to Generalize**. These groups are built directly from each student's pre-quiz (PPQ) performance, ranked from lowest to highest scores.

We use these same groups as our "before" picture. Every student in **all groups except the last** (the strongest group) is considered "needing help before the intervention." The last group represents students who already understood the concept.

For the misconception "Clearing Fractions Incorrectly," this means:

| Group | Role | Students |
|-------|------|:---:|
| **Group A: Needs Concrete Repair** | Needing help | 8 |
| **Group B: Partial Understanding** | Needing help | 7 |
| **Group C: Ready to Generalize** | Already understood | 7 |

**15 students** were identified as needing help before the intervention.

---

## Where "After" Comes From

Each student's follow-up quiz (POST_PPQ) score determines whether they're still struggling. If a student scores **60% or higher** on the follow-up quiz, they are no longer flagged for the misconception. Below 60%, they're still flagged.

---

## Who Gets Counted

We only count students we can fairly compare — meaning they must:

1. **Appear in an activity group** (so we have a "before" picture)
2. **Have taken the follow-up quiz** (so we have an "after" picture)

Students who miss either side are excluded entirely — they don't help or hurt the numbers.

In this example, **4 students** from Groups A+B were absent for the follow-up quiz (Suriel, Frazier, Herrera, Diaby), and **5 new students** took the follow-up quiz but weren't in the original class. Both sets are excluded.

That leaves **16 comparable students**: 11 from the "needing help" groups and 5 from the "understood" group.

---

## How Students Are Classified

Each comparable student falls into one of four buckets:

| Before | After | What It Means |
|--------|-------|---------------|
| Needing help | Passing | **Improved** — the intervention worked for this student |
| Needing help | Still struggling | **Still needing help** — the misconception persists |
| Already understood | Now struggling | **Newly surfaced** — regression after intervention |
| Already understood | Still passing | *(Not shown — nothing changed)* |

For "Clearing Fractions Incorrectly," all 11 comparable students from Groups A+B passed the follow-up quiz:

- **Improved:** 11 students (Balbuena, Burnam, Byrd, K. Carter, K. Carter, Castro, Dowling, Goodmen, Hill, Pena, Purnell)
- **Still needing help:** 0
- **Newly surfaced:** 0

---

## How the Percentage Is Calculated

"Class mastery" means: of the comparable students, what percentage are *not* flagged for this misconception?

**Before the intervention:**
- 16 comparable students total, 11 were needing help
- 5 out of 16 were *not* flagged = **31% class mastery**

**After the intervention:**
- 0 students are still flagged
- 16 out of 16 are *not* flagged = **100% class mastery**

**Improvement: 100% - 31% = +69% class mastery**

The Reflect tab card shows: **11 → 0 students needing support, +69% class mastery**.

---

## Design Considerations

A few decisions that may be worth revisiting:

- **The 60% threshold** — a student needs to score 60% or higher on the follow-up quiz to be considered "no longer struggling." This could be adjusted up or down.
- **Absent students are excluded** — 4 of the 15 "needing help" students didn't take the follow-up quiz. The card shows "11 → 0" rather than "15 → 0" because we can't measure improvement for students we don't have follow-up data on. Should the UI communicate this distinction (e.g., "11 of 15")?
- **New students are excluded** — 5 students appeared in the follow-up quiz who weren't in the original class. Since there's no "before" data for them, they're invisible to the calculation. Should they be surfaced somewhere?
- **One follow-up quiz per session** — the follow-up quiz covers the session's topic broadly, not one misconception at a time. A student's follow-up score is compared against *each* misconception they were grouped into. This means the same quiz score can count as "improved" for one misconception and "still needing help" for another — but in practice the current follow-up quizzes are single-question, so the score is the same across all misconceptions in the session.
