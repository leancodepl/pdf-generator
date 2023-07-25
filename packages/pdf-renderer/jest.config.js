const fs = require("fs");

const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, "utf-8"));

module.exports = {
    displayName: "pdf-renderer",
    preset: "../../jest.preset.js",
    globals: {},
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": ["@swc/jest", config],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/pdf-renderer",
    collectCoverage: true,
    coverageReporters: ["json", "lcov"],
    reporters: ["default", ["jest-junit", { outputName: "test-results/packages/pdf-renderer/report.xml" }]],
};
