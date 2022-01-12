import * as fs from "fs";
import * as path from "path";

const fonts = [
    {
        weight: 600,
        file: "open-sans-v17-latin-ext-600.woff",
    },
    {
        weight: 400,
        file: "open-sans-v17-latin-ext-regular.woff",
    },
];

const openSans = fonts
    .map(font => {
        const file = fs.readFileSync(path.join(__dirname, font.file));
        return `
        @font-face {
            font-family: "Open Sans";
            src: url(data:application/x-font-woff;charset=utf-8;base64,${file.toString("base64")});
            font-style: normal;
            font-weight: ${font.weight};
        }
    `;
    })
    .join("\n");

export default openSans;
