import type { Config } from '@jest/types';
import path from 'path';

const networkingPath = path.resolve(__dirname, '../networking/lib/src');
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['whatwg-fetch'],
  roots: ['<rootDir>'],
  testRegex: '((\\.| /)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  transform: {
    '^.+\\.test.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    // using babel-jest for symlinked modules
    [`(${networkingPath.replace(/\\/g, '\\\\')}).+\\.(js)$`]: 'babel-jest',
    '^.+\\.css$': '<rootDir>/tests/transformers/cssTransform.ts',
    '^.+\\.svg$': '<rootDir>/tests/transformers/svgTransform.ts',
    '^.+\\.png$': '<rootDir>/tests/transformers/pngTransform.ts',
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@aws-sdk|uuid|swiper|ssr-window))',
    '<rootDir>/../networking/node_modules/(?!(@aws-sdk|uuid))',
  ],
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

export default config;
