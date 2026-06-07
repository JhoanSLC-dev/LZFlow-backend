module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFiles: ["<rootDir>/src/__tests__/setup.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "clover"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/server.ts",
        "!src/database/**",
        "!src/**/*.d.ts",
    ],
};
