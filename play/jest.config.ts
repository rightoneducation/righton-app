import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots:["<rootDir>"],
    testRegex: "((\\.| /)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    collectCoverage: true,
    transform: {
        "^.+\\.test.(ts|tsx)$": "ts-jest",
        "^.+\\.svg$": "<rootDir>/tests/transformers/svgTransform.ts",
    },
    transformIgnorePatterns: ["src/.+.(js|jsx)$"],
    watchman: false,
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
}

export default config