import { Inject, NotFoundException } from "@nestjs/common";
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
    fs.readFileSync(fontFile).toString("base64");
};

export class FontLibrary {
    private fonts;

    constructor(@Inject(FontsConfigurationToken) private fontsConfiguration: FontsConfiguration) {
        this.fonts = Object.entries(this.fontsConfiguration).reduce(
            (acc, [font, config]) => ({
                ...acc,
                [font]: `
            @font-face {
                font-family: "${config.fontFamily}";
                src: url(data:application/x-font-woff;charset=utf-8;base64,${readFont(config.fontFile)});
                font-style: ${config.fontStyle ?? "normal"};
                font-weight: ${config.fontWeight ?? 400};
            }`,
            }),
            {} as Record<symbol | string, string>,
        );
    }

    getFont(font: symbol | string): string {
        if (this.fonts[font]) return this.fonts[font];
        throw new NotFoundException(`Font not found ${font.toString()}`);
    }
}
