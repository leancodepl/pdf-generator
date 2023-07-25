const fs = require("fs");

const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, "utf-8"));

/** @type {import('jest').Config} */
module.exports = {
    displayName: "invoice-template",
    preset: "../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": ["@swc/jest", config],
    },
    resolver: "@nx/jest/plugins/resolver",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/packages/invoice-template",
    setupFilesAfterEnv: ["../../jest.setup.js"],
};
