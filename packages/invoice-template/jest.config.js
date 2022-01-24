module.exports = {
    displayName: "invoice-template",
    preset: "../../jest.preset.js",
    transform: {
        "\\.(ts|tsx)?$": "babel-jest",
        "^.+\\.[tj]sx?$": ["@swc/jest", { jsc: { transform: { react: { runtime: "automatic" } } } }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/packages/invoice-template",
};
