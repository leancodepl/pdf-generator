module.exports = {
    displayName: "pdf-renderer",
    preset: "../../jest.preset.js",
    globals: {},
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/pdf-renderer",
    collectCoverage: true,
    coverageReporters: ["json", "lcov"],
    reporters: ["default", ["jest-junit", { outputName: "test-results/packages/pdf-renderer/report.xml" }]],
};
