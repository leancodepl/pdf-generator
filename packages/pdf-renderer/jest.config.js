module.exports = {
    displayName: "pdf-renderer",
    preset: "../../jest.preset.js",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json",
        },
    },
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/pdf-renderer",
    collectCoverage: true,
    coverageReporters: ["json", "lcov"],
    reporters: ["default", ["jest-junit", { outputName: "test-results/packages/pdf-renderer/report.xml" }]],
};
