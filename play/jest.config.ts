import type { Config } from '@jest/types';
import path from 'path';
const networkingPath = path.resolve(__dirname, '../networking/lib/src');
console.log(networkingPath);
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testRegex: '((\\.| /)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  transform: {
    '^.+\\.test.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    // using babel-jest for symlinked modules
    [`(${networkingPath.replace(/\\/g, '\\\\')}).+\\.(js)$`]: 'babel-jest',
    '^.+\\.svg$': '<rootDir>/tests/transformers/svgTransform.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@aws-sdk|uuid))',
    '<rootDir>/../networking/node_modules/(?!(@aws-sdk|uuid))',
  ],
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

export default config;
