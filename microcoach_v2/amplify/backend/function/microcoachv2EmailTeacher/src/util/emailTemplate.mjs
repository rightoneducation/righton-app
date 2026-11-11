/**
 * The "your results are ready" email a teacher gets when a reviewer publishes
 * their upload (MIU 1's next steps, or MIU 2's reflection results).
 *
 * Drawn from the QA email cards (microcoach-assets/qa1/emailcards: Miu1EmailCard,
 * Miu2EmailCard), scaled from their 1270px frame to a 600px email. Kept to what
 * basic HTML email renders everywhere: tables, inline styles, no images. Cut
 * from the cards: the decorative corner pattern (vector art), the drop shadows,
 * and the Rubik/Poppins web fonts (named first, so they're used where installed).
 * Shape follows v1's upload email (microcoachTeacherUploadGen): HTML plus a
 * plain-text twin.
 */

const NAVY_HEADER = '#1B3467';
const NAVY = '#1B376F';
const MUTED = '#635F5F';
const RULE = '#A3A3A3';
const PAGE = '#FAFDFE';
const FOOTER = '#E0E0E0';
const FONT = "Rubik, Poppins, Arial, Helvetica, sans-serif";

const COPY = {
  PPQ: {
    subject: (className) => `Your MicroCoach next steps are ready — ${className}`,
    title: 'Your instructional next steps are ready',
    body: 'MicroCoach has identified misconception patterns and suggested next steps. You choose what fits your students best.',
    docxLabel: 'MIU Answer Keys',
  },
  POST_PPQ: {
    subject: (className) => `Your MicroCoach reflection results are ready — ${className}`,
    title: 'Your reflection results are ready',
    body: "See how your students' understanding changed after this week's activity.",
    docxLabel: 'MIU Exemplar',
  },
};

const FOOTER_TEXT = 'RightOn Education · MicroCoach · helping teachers act on what students actually know';

const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * @param {{ kind: 'PPQ' | 'POST_PPQ', teacherName: string, teacherEmail: string,
 *   className: string, weekLabel: string | null, docxName: string, xlsxName: string,
 *   loginUrl: string }} details
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildResultsEmail(details) {
  const copy = COPY[details.kind];
  const rows = [
    ['Teacher', `${escape(details.teacherName)}<br><span style="color:${MUTED};">${escape(details.teacherEmail)}</span>`],
    ['Class', escape(details.className)],
    // Uploads from before the label was saved have none: the row is left out.
    ...(details.weekLabel ? [['Week', escape(details.weekLabel)]] : []),
    [copy.docxLabel, escape(details.docxName)],
    ['MIU Responses', escape(details.xlsxName)],
  ];
  const rowHtml = rows
    .map(
      ([label, value], i) => `
              <tr>
                <td style="padding:12px 0;font-size:14px;color:${NAVY};font-weight:500;${i < rows.length - 1 ? `border-bottom:1px solid ${RULE};` : ''}">${label}</td>
                <td align="right" style="padding:12px 0;font-size:14px;color:${NAVY};${i < rows.length - 1 ? `border-bottom:1px solid ${RULE};` : ''}">${value}</td>
              </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAGE};font-family:${FONT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;">
        <tr><td style="background:${NAVY_HEADER};padding:20px 32px;color:#FFFFFF;font-size:18px;font-weight:600;">RightOn MicroCoach</td></tr>
        <tr><td align="center" style="padding:40px 32px 8px;color:${NAVY};font-size:26px;font-weight:500;line-height:1.25;">${copy.title}</td></tr>
        <tr><td align="center" style="padding:8px 48px 28px;color:${MUTED};font-size:15px;line-height:1.5;">${copy.body}</td></tr>
        <tr><td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${NAVY};border-radius:12px;">
            <tr><td style="padding:16px 24px 4px;color:${NAVY};font-size:12px;font-weight:600;letter-spacing:1px;">UPLOADED</td></tr>
            <tr><td style="padding:0 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:32px 32px 40px;">
          <a href="${escape(details.loginUrl)}" style="display:inline-block;background:${NAVY};color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:500;padding:14px 32px;border-radius:28px;">Log in to MicroCoach</a>
        </td></tr>
        <tr><td align="center" style="background:${FOOTER};padding:16px 32px;color:${MUTED};font-size:12px;">${FOOTER_TEXT}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    copy.title,
    '',
    copy.body,
    '',
    'UPLOADED',
    `Teacher: ${details.teacherName} (${details.teacherEmail})`,
    `Class: ${details.className}`,
    ...(details.weekLabel ? [`Week: ${details.weekLabel}`] : []),
    `${copy.docxLabel}: ${details.docxName}`,
    `MIU Responses: ${details.xlsxName}`,
    '',
    `Log in to MicroCoach: ${details.loginUrl}`,
    '',
    FOOTER_TEXT,
  ].join('\n');

  return { subject: copy.subject(details.className), html, text };
}
