import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",

    testRegex: "((\\.| /)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: ["ts", "js", "json"],
    collectCoverage: true,
    transform: {
        "^.+\\.test.(ts|tsx)$": "ts-jest",
    },
    transformIgnorePatterns: ["src/.+.(js|jsx)$"],
    // uuid ships ESM by default, which jest can't parse under this CJS setup. Point it at uuid's
    // own CommonJS build (its package.json "main") so importing it from src/ doesn't blow up.
    moduleNameMapper: {
        "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
    },
}

export default config
