import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { AUTH_FILE } from './playwright.config';

// Opens a real browser on /login and waits for you to sign in by hand (email
// or Google). Once the app reaches /dashboard, the session (Amplify keeps its
// tokens in localStorage) is saved for qa:shots. No credentials touch disk.
test('sign in once and save the session', async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);
  await page.goto('/login');
  await page.waitForURL('**/dashboard', { timeout: 10 * 60 * 1000 });
  await page.waitForLoadState('networkidle');
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
