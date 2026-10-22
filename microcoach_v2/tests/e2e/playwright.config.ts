import path from 'path';
import { defineConfig } from '@playwright/test';

// QA screenshots of the running app (yarn qa:login once, then yarn qa:shots).
// Read-only against the dev env: see screens.spec.ts for what is never clicked.

export const AUTH_FILE = path.join(__dirname, '.auth', 'state.json');
export const OUTPUT_DIR = path.join(__dirname, 'output');

export default defineConfig({
  testDir: __dirname,
  outputDir: path.join(OUTPUT_DIR, 'test-results'),
  // One worker: the run walks one signed-in session and writes one report.
  workers: 1,
  fullyParallel: false,
  timeout: 30 * 60 * 1000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
  },
  webServer: {
    command: 'BROWSER=none yarn start',
    cwd: path.join(__dirname, '..', '..'),
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 5 * 60 * 1000,
  },
  projects: [
    {
      name: 'login',
      testMatch: /auth\.setup\.ts/,
      use: { headless: false, viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'shots',
      testMatch: /screens\.spec\.ts/,
      use: { storageState: AUTH_FILE },
    },
  ],
});
