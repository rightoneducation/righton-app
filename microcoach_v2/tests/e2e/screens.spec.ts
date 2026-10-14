/* eslint-disable no-restricted-syntax, no-await-in-loop, @typescript-eslint/no-loop-func --
   a browser walk is sequential by nature: each step waits on the last. */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Page, test } from '@playwright/test';
import { OUTPUT_DIR } from './playwright.config';

/*
 * Walks every signed-in screen at the Figma widths and saves full-page
 * screenshots plus a report (console errors, failed requests, raw i18n keys,
 * horizontal overflow) to tests/e2e/output.
 *
 * READ-ONLY against the dev env:
 *   - every GraphQL mutation and every S3 write is aborted at the network
 *     layer and listed under "blocked" in the report;
 *   - never clicked: Submit files for analysis, Select activity, the activity
 *     flow's Back/Next (the last one saves a plan), delete, save, sign out.
 * Phases are reached by URL instead of the Next buttons.
 */

const WIDTHS = [393, 744, 1692, 1920];
const HEIGHT: Record<number, number> = { 393: 852, 744: 1133, 1692: 1121, 1920: 1200 };
// Interactions (menus, modals, upload states) are captured at these only.
const INTERACTION_WIDTHS = [393, 1692];
const FIXTURES = path.join(os.homedir(), 'Desktop', 'microcoach-assets', 'data');
const DOCX = path.join(FIXTURES, 'Gr8_Math_MixItUp_Week6.docx');
const XLSX = path.join(FIXTURES, 'Justice.xlsx');

interface ShotRecord {
  name: string;
  width: number;
  url: string;
  file: string;
  consoleErrors: string[];
  failedRequests: string[];
  blocked: string[];
  rawKeys: string[];
  overflowPx: number;
}

const report: ShotRecord[] = [];
const unreachable: string[] = [];
let events = { consoleErrors: [] as string[], failedRequests: [] as string[], blocked: [] as string[] };
// Requests this script aborted, so they are not reported as failures too.
const aborted = new Set<string>();

async function guard(page: Page) {
  events = { consoleErrors: [], failedRequests: [], blocked: [] };
  // Abort writes: GraphQL mutations and S3 PUT/POST/DELETE.
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();
    const body = request.postData() ?? '';
    const isMutation = url.includes('/graphql') && /"query"\s*:\s*"\s*mutation/.test(body);
    const isS3Write = /\.s3[.-]|s3\.amazonaws/.test(url) && method !== 'GET' && method !== 'HEAD';
    if (isMutation || isS3Write) {
      aborted.add(url);
      events.blocked.push(`${method} ${url.split('?')[0]}${isMutation ? ` ${body.slice(0, 120)}` : ''}`);
      await route.abort();
      return;
    }
    await route.continue();
  });
  page.on('console', (message) => {
    if (message.type() === 'error') events.consoleErrors.push(message.text().slice(0, 300));
  });
  page.on('pageerror', (error) => events.consoleErrors.push(`pageerror: ${error.message.slice(0, 300)}`));
  page.on('requestfailed', (request) => {
    if (aborted.has(request.url())) return;
    const failure = request.failure()?.errorText ?? '';
    events.failedRequests.push(`${request.method()} ${request.url().split('?')[0]} ${failure}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      events.failedRequests.push(`${response.status()} ${response.url().split('?')[0]}`);
    }
  });
}

async function settle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => undefined);
  await page
    .waitForFunction(() => !document.querySelector('[role="progressbar"]'), undefined, { timeout: 20000 })
    .catch(() => undefined);
  await page.waitForTimeout(400);
}

async function capture(page: Page, name: string, width: number) {
  await settle(page);
  const rawKeys = await page.evaluate(() => {
    // Text that looks like an untranslated key: "dashboard.cta.ASSESS".
    const found = new Set<string>();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const text = node.textContent ?? '';
      const matches = text.match(/\b[a-z][a-zA-Z]+(\.[a-zA-Z0-9_]+)+\b/g) ?? [];
      matches
        .filter((m) => !/\.(docx|xlsx|pdf|com|org|edu|us|net|io)$/i.test(m) && !text.includes('@'))
        .forEach((m) => found.add(m));
      node = walker.nextNode();
    }
    return Array.from(found);
  });
  const overflowPx = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  const file = path.join(OUTPUT_DIR, String(width), `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  report.push({ name, width, url: page.url(), file, ...events, rawKeys, overflowPx });
  events = { consoleErrors: [], failedRequests: [], blocked: [] };
}

async function visit(page: Page, name: string, url: string, width: number) {
  await page.goto(url);
  await capture(page, name, width);
}

// Discovered once: a misconception and an activity to open.
let choosePath: string | null = null;
let activityId: string | null = null;

test.beforeAll(() => {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  WIDTHS.forEach((width) => fs.mkdirSync(path.join(OUTPUT_DIR, String(width)), { recursive: true }));
});

test('discover dynamic routes', async ({ page }) => {
  await guard(page);
  await page.setViewportSize({ width: 1920, height: 1200 });
  await page.goto('/review');
  await settle(page);
  const select = page.getByRole('button', { name: 'Select', exact: true }).first();
  if (await select.count()) {
    await select.click();
    await page.waitForURL('**/review/*/activities', { timeout: 15000 }).catch(() => undefined);
    if (/\/review\/[^/]+\/activities/.test(page.url())) choosePath = new URL(page.url()).pathname;
    await settle(page);
    const details = page.getByRole('button', { name: 'View activity details' }).first();
    if (await details.count()) {
      await details.click();
      await page.waitForURL('**/activity/*/before-class', { timeout: 15000 }).catch(() => undefined);
      activityId = new URL(page.url()).pathname.split('/')[2] ?? null;
    }
  }
  if (!choosePath) unreachable.push('Select Activity: no misconception on /review for the selected class');
  if (!activityId) unreachable.push('Activity pages: no activity to open from Select Activity');
});

for (const width of WIDTHS) {
  test(`screens at ${width}`, async ({ page }) => {
    await guard(page);
    await page.setViewportSize({ width, height: HEIGHT[width] });

    const pages: [string, string][] = [
      ['landing', '/'],
      ['dashboard', '/dashboard'],
      ['past-activities', '/past-activities'],
      ['review', '/review'],
      ['myactivity', '/myactivity'],
      ['reflect', '/reflect'],
      ['profile', '/profile'],
      ['profile-password', '/profile/password'],
      ['upload-miu', '/upload-miu'],
      ['upload-reassess', '/upload-reassess'],
      ['redirect-this-week', '/this-week'],
      ['redirect-myplan', '/myplan'],
      ['footer-privacy', '/privacy'],
      ['unknown-route', '/qa-not-a-route'],
    ];
    if (choosePath) pages.push(['choose-activity', choosePath]);
    if (activityId) {
      pages.push(
        ['activity-before-class', `/activity/${activityId}/before-class`],
        ['activity-facilitate', `/activity/${activityId}/facilitate`],
        ['activity-discussion', `/activity/${activityId}/discussion`],
        ['activity-no-phase', `/activity/${activityId}`],
      );
    }
    for (const [name, url] of pages) {
      await visit(page, name, url, width);
    }

    if (!INTERACTION_WIDTHS.includes(width)) return;

    // Home: avatar menu, More classes, each class chip.
    await page.goto('/dashboard');
    await settle(page);
    const avatar = page.getByRole('button', { name: 'Account menu' });
    if (await avatar.count()) {
      await avatar.click();
      await capture(page, 'dashboard-avatar-menu', width);
      await page.keyboard.press('Escape');
    }
    const more = page.getByRole('button', { name: 'More' });
    if (await more.count()) {
      await more.click();
      await capture(page, 'dashboard-more-classes', width);
      await page.keyboard.press('Escape');
    }
    const chips = page.locator('button[aria-pressed]');
    const original = await page.locator('button[aria-pressed="true"]').first().textContent().catch(() => null);
    const chipCount = await chips.count();
    for (let i = 0; i < chipCount; i += 1) {
      const chip = chips.nth(i);
      const label = ((await chip.textContent()) ?? `class-${i}`).trim().replace(/\W+/g, '-');
      await chip.click();
      await capture(page, `dashboard-class-${label}`, width);
    }
    if (original) await page.getByRole('button', { name: original.trim(), exact: true }).first().click();

    // Past Activities: the sort menu and each order.
    await page.goto('/past-activities');
    await settle(page);
    const sort = page.getByRole('button', { name: 'Sort activities' });
    if (await sort.count()) {
      await sort.click();
      await capture(page, 'past-sort-menu', width);
      for (const option of ['Date: Oldest first', 'By class: A-Z', 'Date: Newest first']) {
        await page.getByRole('menuitem', { name: option }).click();
        await capture(page, `past-sort-${option.replace(/\W+/g, '-')}`, width);
        if (option !== 'Date: Newest first') await sort.click();
      }
    }

    // Review: the misconception details modal and its tabs.
    await page.goto('/review');
    await settle(page);
    const viewDetails = page.getByRole('button', { name: 'View details' }).first();
    if (await viewDetails.count()) {
      await viewDetails.click();
      await capture(page, 'review-details-modal', width);
      const tabs = page.getByRole('tab');
      const tabCount = await tabs.count();
      for (let i = 1; i < tabCount; i += 1) {
        await tabs.nth(i).click();
        await capture(page, `review-details-tab-${i + 1}`, width);
      }
      await page.keyboard.press('Escape');
    }

    // Facilitate: the student view.
    if (activityId) {
      await page.goto(`/activity/${activityId}/facilitate`);
      await settle(page);
      const studentView = page.getByRole('button', { name: /Student View/ }).first();
      if (await studentView.count()) {
        await studentView.click();
        await capture(page, 'activity-facilitate-student', width);
      }
    }

    // Upload: a wrong type, then both files, then the review step. Stops there.
    if (fs.existsSync(DOCX) && fs.existsSync(XLSX)) {
      await page.goto('/upload-miu');
      await settle(page);
      const docxInput = page.locator('input[type="file"][accept*="docx"], input[type="file"][accept*="word"]').first();
      const xlsxInput = page.locator('input[type="file"][accept*="xlsx"], input[type="file"][accept*="sheet"]').first();
      if ((await docxInput.count()) && (await xlsxInput.count())) {
        await docxInput.setInputFiles(XLSX);
        await capture(page, 'upload-wrong-type', width);
        await docxInput.setInputFiles(DOCX);
        await xlsxInput.setInputFiles(XLSX);
        await capture(page, 'upload-both-completed', width);
        const continueButton = page.getByRole('button', { name: 'Continue' });
        if (await continueButton.isEnabled().catch(() => false)) {
          await continueButton.click();
          await capture(page, 'upload-review', width);
        } else {
          unreachable.push(`Upload review at ${width}: Continue stayed disabled (no class selected?)`);
        }
      } else {
        unreachable.push(`Upload at ${width}: file inputs not found`);
      }
    } else {
      unreachable.push('Upload states: fixture files missing from ~/Desktop/microcoach-assets/data');
    }
  });
}

test.afterAll(() => {
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'report.json'),
    JSON.stringify({ unreachable, shots: report }, null, 2),
  );
  const flagged = report.filter(
    (r) => r.consoleErrors.length || r.failedRequests.length || r.blocked.length || r.rawKeys.length || r.overflowPx > 0,
  );
  const lines = [
    `# QA screenshots — ${new Date().toISOString()}`,
    '',
    `${report.length} screenshots, ${flagged.length} with something flagged.`,
    '',
    ...unreachable.map((u) => `- not reachable: ${u}`),
    '',
    ...flagged.map((r) =>
      [
        `## ${r.name} @ ${r.width}`,
        r.overflowPx > 0 ? `- horizontal overflow: ${r.overflowPx}px` : '',
        ...r.rawKeys.map((k) => `- raw key: ${k}`),
        ...r.blocked.map((b) => `- BLOCKED write: ${b}`),
        ...r.consoleErrors.map((e) => `- console: ${e}`),
        ...r.failedRequests.map((f) => `- request: ${f}`),
      ]
        .filter(Boolean)
        .join('\n'),
    ),
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, 'summary.md'), lines.join('\n'));
});
