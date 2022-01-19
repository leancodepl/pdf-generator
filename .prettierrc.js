const baseConfig = require("@leancode/prettier-config");

module.exports = {
    ...baseConfig,
    overrides: [
        ...baseConfig.overrides,
        {
            files: "*.yml",
            options: {
                tabWidth: 2,
            },
        },
    ],
};
