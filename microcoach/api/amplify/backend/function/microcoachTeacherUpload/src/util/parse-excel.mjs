import * as XLSX from 'xlsx';

/**
 * Convert a confidence letter (A–D, or adjacent pair AB/BC/CD) to a numeric value.
 */
function parseConfidenceLetter(raw) {
  const val = raw.trim().toUpperCase();
  if (!val) return undefined;
  const map = { A: 5, B: 4, C: 3, D: 1 };
  if (val.length === 1) return map[val];
  if (val.length === 2) {
    const s1 = map[val[0]], s2 = map[val[1]];
    if (s1 == null || s2 == null) return undefined;
    const order = 'ABCD';
    if (order.indexOf(val[1]) === order.indexOf(val[0]) + 1) return (s1 + s2) / 2;
    return undefined;
  }
  return undefined;
}

export function deriveTopic(ccss) {
  if (ccss.includes('6.NS')) return 'Dividing Fractions';
  if (ccss.includes('8.EE')) return 'Linear Equations and Systems';
  if (ccss.includes('8.F')) return 'Functions and Rate of Change';
  if (ccss.includes('6.EE')) return 'Expressions and Equations';
  if (ccss.includes('7.RP')) return 'Ratios and Proportional Relationships';
  return 'Math';
}

/**
 * Parse a PPQ or PostPPQ Excel file from a Buffer.
 * Supports two layouts: GENERATED (synthetic) and ASSESSMENT MATRIX (real district data).
 */
export function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length < 8) {
    throw new Error(`Excel file has fewer than 8 rows — unexpected format`);
  }

  const isAssessmentMatrix = String(rows[1]?.[0] ?? '').includes('Assessment Matrix');

  // Assessment code
  let assessmentCode;
  if (isAssessmentMatrix) {
    const title = String(rows[1][0] ?? '');
    const colonIdx = title.indexOf(':');
    assessmentCode = (colonIdx >= 0 ? title.slice(colonIdx + 1) : title).trim();
  } else {
    assessmentCode = String(
      rows[0].find((v) => v !== '' && v !== null && v !== undefined) ?? 'UNKNOWN'
    ).trim();
  }

  // CCSS standards
  const ccssRow = rows[1] ?? [];
  const ccssStandards = isAssessmentMatrix
    ? []
    : ccssRow
        .slice(1)
        .map((v) => String(v ?? '').trim())
        .filter((v) => v.length > 0 && /\d/.test(v));

  // All numeric-header columns from row 2
  const headerRow = rows[2] ?? [];
  const allNumericCols = [];
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    if (cell.match(/^q?(\d+)$/i)) allNumericCols.push(col);
  }

  // Legacy confidence columns (Q1_Conf style)
  const confColByQNumber = {};
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    const cMatch = cell.match(/^Q?(\d+)_Conf$/i);
    if (cMatch) confColByQNumber[parseInt(cMatch[1], 10)] = col;
  }

  // Answer key
  const answerKeyRowIdx = isAssessmentMatrix ? 6 : 7;
  const keyRow = rows[answerKeyRowIdx] ?? [];

  // Interleaved confidence detection
  let isInterleaved = false;
  let questionColumns = [...allNumericCols];
  let questionNumbers = allNumericCols.map((col) => {
    const cell = String(headerRow[col] ?? '').trim();
    return parseInt(cell.replace(/^q/i, ''), 10);
  });

  if (isAssessmentMatrix && Object.keys(confColByQNumber).length === 0) {
    const quizCols = [];
    const quizNums = [];
    const newConfColByQNumber = {};
    let quizSeq = 0;

    for (const col of allNumericCols) {
      const keyVal = String(keyRow[col] ?? '').trim().toUpperCase();
      if (keyVal.length === 1 && 'ABCDE'.includes(keyVal)) {
        quizSeq++;
        quizCols.push(col);
        quizNums.push(quizSeq);
      } else if (keyVal === '' && quizSeq > 0 && newConfColByQNumber[quizSeq] == null) {
        newConfColByQNumber[quizSeq] = col;
      }
    }

    if (quizCols.length > 0 && Object.keys(newConfColByQNumber).length > 0) {
      isInterleaved = true;
      questionColumns = quizCols;
      questionNumbers = quizNums;
      Object.assign(confColByQNumber, newConfColByQNumber);
    }
  }

  // Class % correct per question
  const classRow = rows[3] ?? [];
  const classPercentByCol = {};
  for (const col of questionColumns) {
    const val = classRow[col];
    if (val !== '' && val != null) {
      const pct = parseFloat(String(val));
      classPercentByCol[col] = isNaN(pct) ? 0 : pct > 1 ? pct / 100 : pct;
    }
  }
  const pctValues = Object.values(classPercentByCol);
  const classPercentCorrect =
    pctValues.length > 0 ? pctValues.reduce((a, b) => a + b, 0) / pctValues.length : 0;

  // Answer key by column
  const answerKeyByCol = {};
  for (const col of questionColumns) {
    const val = String(keyRow[col] ?? '').trim().toUpperCase();
    if (val.length === 1 && 'ABCDE'.includes(val)) {
      answerKeyByCol[col] = val;
    }
  }

  const questionMeta = questionColumns.map((col, i) => ({
    questionNumber: questionNumbers[i],
    correctAnswer: answerKeyByCol[col] ?? '',
    classPercentCorrect: classPercentByCol[col] ?? 0,
    ccssStandard: ccssStandards[i] ?? ccssStandards[0] ?? '',
  }));

  // Student rows
  const studentStartRow = isAssessmentMatrix ? 7 : 8;
  const nameCol = isAssessmentMatrix ? 1 : 0;
  const externalIdCol = isAssessmentMatrix ? 2 : 1;
  const scoreCol = isAssessmentMatrix ? 5 : 2;

  const studentRows = [];
  for (let r = studentStartRow; r < rows.length; r++) {
    const row = rows[r];
    const name = String(row[nameCol] ?? '').trim();
    if (!name) continue;
    if (name.toLowerCase().includes('total') || name.toLowerCase().includes('average')) continue;

    const externalId = String(row[externalIdCol] ?? '').trim();
    const rawScore = parseFloat(String(row[scoreCol] ?? '0'));
    let totalScore = isNaN(rawScore) ? 0 : rawScore;
    if (isAssessmentMatrix) {
      totalScore = totalScore / 100;
    } else if (totalScore > 1) {
      totalScore = totalScore / 100;
    }

    const questionResponses = questionColumns.map((col, i) => {
      const rawResponse = String(row[col] ?? '').trim().toUpperCase();
      const correctAnswer = answerKeyByCol[col] ?? '';
      const qNum = questionNumbers[i];
      const confCol = confColByQNumber[qNum];

      let confidence;
      if (confCol != null) {
        const rawConf = String(row[confCol] ?? '').trim();
        if (isInterleaved) {
          confidence = parseConfidenceLetter(rawConf);
        } else {
          const n = parseFloat(rawConf);
          confidence = !isNaN(n) && n >= 1 && n <= 5 ? n : undefined;
        }
      }

      if (isAssessmentMatrix) {
        if (rawResponse === '') return null;
        const isCorrect = correctAnswer !== '' && rawResponse === correctAnswer;
        return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
      }

      const isCorrect = rawResponse !== '' && rawResponse === correctAnswer;
      return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
    }).filter((r) => r !== null);

    studentRows.push({ name, externalId, totalScore, questionResponses });
  }

  const weekMatch = assessmentCode.match(/W(\d+)/i);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : 0;
  const topic = deriveTopic(ccssStandards[0] ?? '');

  return {
    assessmentCode,
    ccssStandards,
    weekNumber,
    topic,
    classPercentCorrect,
    questionMeta,
    students: studentRows,
  };
}
