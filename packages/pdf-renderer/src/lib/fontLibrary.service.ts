import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as fs from "fs";

export const FontsConfigurationToken = Symbol("FontsConfiguration");

export type FontConfiguration = {
    fontFamily: string;
    fontFile: string | Buffer;
    fontStyle?: string;
    fontWeight?: string | number;
};

export type FontsConfiguration = Record<symbol | string, FontConfiguration>;

const readFont = (fontFile: string | Buffer) => {
    const buffer = typeof fontFile === "string" ? fs.readFileSync(fontFile) : fontFile;
    return buffer.toString("base64");
};

@Injectable()
export class FontLibrary {
    private fonts;

    constructor(@Inject(FontsConfigurationToken) private readonly fontsConfiguration: FontsConfiguration) {
        this.fonts = [
            ...Object.getOwnPropertySymbols(this.fontsConfiguration),
            ...Object.getOwnPropertyNames(this.fontsConfiguration),
        ].reduce((acc, font) => {
            const { fontFamily, fontFile, fontStyle, fontWeight } = fontsConfiguration[font];

            return {
                ...acc,
                [font]: `
            @font-face {
                font-family: "${fontFamily}";
                src: url(data:application/x-font-woff;charset=utf-8;base64,${readFont(fontFile)});
                ${fontStyle ? `font-style: ${fontStyle}` : ""};
                ${fontWeight ? `font-weight: ${fontWeight}` : ""};
            }`,
            };
        }, {} as Record<symbol | string, string>);
    }

    getFont(font: symbol | string): string {
        if (this.fonts[font]) return this.fonts[font];
        throw new NotFoundException(`Font not found ${font.toString()}`);
    }
}
