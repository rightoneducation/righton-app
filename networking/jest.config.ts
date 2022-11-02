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
}

export default config
