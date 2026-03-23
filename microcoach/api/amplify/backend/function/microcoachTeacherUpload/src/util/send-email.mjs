import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.REGION || 'us-east-1' });

export async function sendEmail(subject, bodyText) {
  const fromEmail = process.env.NOTIFY_FROM_EMAIL;
  const toEmails = (process.env.NOTIFY_TO_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

  if (!fromEmail || !toEmails.length) {
    console.log('Email notification skipped — NOTIFY_FROM_EMAIL or NOTIFY_TO_EMAILS not configured');
    return;
  }

  await ses.send(new SendEmailCommand({
    Source: fromEmail,
    Destination: { ToAddresses: toEmails },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: bodyText } },
    },
  }));

  console.log(`Email sent to ${toEmails.join(', ')}`);
}
