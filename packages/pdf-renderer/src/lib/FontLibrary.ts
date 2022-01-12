import { Inject, NotFoundException } from "@nestjs/common";
import * as fs from "fs";

export const FontsConfigurationToken = Symbol("FontsConfiguration");

type FontConfiguration = {
    fontFamily: string;
    fontFile: string | Buffer;
    fontStyle?: string;
    fontWeight?: string | number;
};

export type FontsConfiguration = Record<symbol | string, FontConfiguration>;

export class FontLibrary {
    private fonts: Record<symbol | string, string>;

    constructor(@Inject(FontsConfigurationToken) private fontsConfiguration: FontsConfiguration) {
        this.fonts = Object.entries(this.fontsConfiguration).reduce(
            (acc, curr) => ({
                ...acc,
                [curr[0]]: `
            @font-face {
                font-family: "${curr[1].fontFamily}";
                src: url(data:application/x-font-woff;charset=utf-8;base64,${fs
                    .readFileSync(curr[1].fontFile)
                    .toString("base64")});
                font-style: ${curr[1].fontStyle};
                font-weight: ${curr[1].fontWeight};
            }`,
            }),
            {},
        );
    }

    getFont(font: symbol | string): string {
        if (this.fonts[font]) return this.fonts[font];
        throw new NotFoundException(`Font not found ${font.toString()}`);
    }
}
