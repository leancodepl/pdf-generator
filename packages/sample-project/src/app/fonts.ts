import { FontsConfiguration } from "@pdf-generator/pdf-renderer";
import path = require("path");

export const OpenSansRegular = Symbol("OpenSansRegular");
export const OpenSansBold = Symbol("OpenSansBold");

const fontsPath = path.join(__dirname, "assets", "fonts", "OpenSans");

export const fontsConfiguration: FontsConfiguration = {
    [OpenSansRegular]: {
        fontFamily: "Open Sans",
        fontFile: path.join(fontsPath, "open-sans-v17-latin-ext-regular.woff"),
        fontStyle: "normal",
        fontWeight: 400,
    },
    [OpenSansBold]: {
        fontFamily: "Open Sans",
        fontFile: path.join(fontsPath, "open-sans-v17-latin-ext-600.woff"),
        fontStyle: "normal",
        fontWeight: 600,
    },
};
