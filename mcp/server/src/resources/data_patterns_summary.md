# Data Patterns Summary

## Dataset Overview
- **Total students**: 138
- **Total sessions**: 100
- **Students in 1 session**: 115 (83.3%)
- **Students in 2+ sessions**: 23 (16.7%)
- **Students with 5+ answers**: 8

## Phase Structure
- **Phase 1**: CHOOSE_CORRECT_ANSWER
- **Phase 2**: CHOOSE_TRICKIEST_ANSWER
- **Students in both phases**: 70 (93% of those with data)

## Identified Patterns

### 1. Phase Consistency Pattern
**Definition**: Students who chose the same answer in both Phase 1 and Phase 2
- **Count**: 29 students (41.4% of those with both phases)
- **Match rate**: 36.5% (35/96 comparisons)
- **Common answers**: "1/2", "1/4", "32", "Undetermined, because you cannot have an exponent that is a fraction"

### 2. Optimal Learning Pathway Pattern
**Definition**: Students who chose wrong answers in Phase 1, then chose the same wrong answers in Phase 2
- **Count**: 29 students (21.0% of total)
- **Top performers**: STUDENT_6 (2 instances), STUDENT_7 (2 instances), STUDENT_9 (2 instances)

### 3. Learning Progression Pattern
**Definition**: Students with optimal learning pathway + improvement evidence in subsequent sessions
- **Count**: 4 students (36.4% of those with multiple sessions)
- **Students**: STUDENT_1, STUDENT_3, STUDENT_24, STUDENT_73

### 4. Improvement Evidence Types
**Type A - Complete Mastery**: Got correct answer in subsequent session
- **Students**: STUDENT_3 (256), STUDENT_73 (20)

**Type B - Sophisticated Errors**: Chose more popular wrong answers in subsequent session
- **Students**: STUDENT_1 (22, popularity: 2), STUDENT_24 (5, popularity: 1)

### 5. Concept Similarity Pattern
**Definition**: Sessions testing similar mathematical concepts
- **STUDENT_1**: 100% similarity (Probability → Algebra)
- **STUDENT_3**: 60% similarity (Probability → Exponents/Roots)
- **STUDENT_24**: 100% similarity (Probability → Algebra)
- **STUDENT_73**: 60% similarity (Exponents → Order of Operations)

### 6. Mathematical Concept Patterns
**Most common concepts across sessions**:
- Algebra (solving equations, variables)
- Arithmetic (basic operations)
- Fractions (manipulation, probability, ratios)

**Learning progression patterns**:
- Probability → Algebra (STUDENT_1, STUDENT_24)
- Probability → Exponents/Roots (STUDENT_3)
- Exponents → Order of Operations (STUDENT_73)

### 7. Session Size Patterns
- **Sessions with 0 students**: 65
- **Sessions with 1 student**: 15
- **Sessions with 7+ students**: 8
- **Largest session**: 17 students

### 8. Answer Popularity Patterns
**Most common wrong answers**:
- "1/2" (appeared in multiple sessions)
- "32" (exponent confusion)
- "Undetermined, because you cannot have an exponent that is a fraction" (conceptual error)

## Data Quality Patterns

### High-Quality Students (Multiple sessions + substantial data)
1. **STUDENT_6**: 3 sessions, 5 answers
2. **STUDENT_1**: 3 sessions, 5 answers
3. **STUDENT_8**: 3 sessions, 7 answers
4. **STUDENT_36**: 3 sessions, 7 answers
5. **STUDENT_37**: 2 sessions, 5 answers
6. **STUDENT_24**: 4 sessions, 6 answers
7. **STUDENT_3**: 2 sessions, 5 answers
8. **STUDENT_11**: 3 sessions, 7 answers

### Students with Optimal Learning but No Improvement
- **STUDENT_6**: 2 optimal learning sessions, 3 total sessions
- **STUDENT_7**: 2 optimal learning sessions, 2 total sessions
- **STUDENT_9**: 2 optimal learning sessions, 3 total sessions
- **STUDENT_108**: 1 optimal learning session, 2 total sessions
- **STUDENT_74**: 1 optimal learning session, 2 total sessions
- **STUDENT_45**: 1 optimal learning session, 4 total sessions
- **STUDENT_54**: 1 optimal learning session, 3 total sessions

## Generated Files
- `enhanced_phased_student_data.json` - Complete dataset with phase analysis
- `phased_student_data.json` - Basic phased dataset
- `filtered_student_data.json` - Filtered dataset without phase analysis
