/**
 * Applies the document's answer key where the spreadsheet was scored against a
 * different one (Week 11 Monday's report has Q3 and Q5 keyed wrong). Only the
 * questions that disagree change. It can work because every student's choice is
 * known: parseResults fills a green cell with the key letter the report scored by.
 *
 * Mutates `results`. Returns what it changed so the caller can report it: a wrong
 * document would re-score a class, so this must never happen silently.
 */
export function rescore(results, doc) {
  const overrides = [];
  results.questions.forEach((question, i) => {
    const docKey = doc.questions[i].correctAnswer;
    if (docKey === question.correctAnswer) return;
    overrides.push({ docxQuestion: question.docxQuestion, from: question.correctAnswer, to: docKey });

    let correct = 0;
    results.students.forEach((student) => {
      const answer = student.questionResponses[i];
      // A skipped question or a double mark ("BD") isn't the answer.
      answer.isCorrect = answer.response === docKey;
      answer.pointsEarned = answer.isCorrect ? 1 : 0;
      if (answer.isCorrect) correct += 1;
    });
    question.correctAnswer = docKey;
    question.classPercentCorrect = correct / results.students.length;
  });

  if (overrides.length) {
    results.students.forEach((student) => {
      const correct = student.questionResponses.filter((q) => q.isCorrect).length;
      student.totalScore = correct / results.questions.length;
    });
    results.classPercentCorrect = results.questions
      .reduce((sum, q) => sum + q.classPercentCorrect, 0) / results.questions.length;
  }
  return overrides;
}
