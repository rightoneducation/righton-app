import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.REGION || 'us-east-1' });

export async function sendEmail(subject, bodyHtml, bodyText) {
  const fromEmail = process.env.NOTIFY_FROM_EMAIL;
  const toEmails = (process.env.NOTIFY_TO_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

  if (!fromEmail || !toEmails.length) {
    console.log('Email notification skipped — NOTIFY_FROM_EMAIL or NOTIFY_TO_EMAILS not configured');
    return;
  }

  const body = {};
  if (bodyHtml) body.Html = { Data: bodyHtml };
  if (bodyText) body.Text = { Data: bodyText };
  if (!bodyHtml && !bodyText) body.Text = { Data: '' };

  await ses.send(new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: toEmails },
    Message: {
      Subject: { Data: subject },
      Body: body,
    },
  }));

  console.log(`Email sent to ${toEmails.join(', ')}`);
}
