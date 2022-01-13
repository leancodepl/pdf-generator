import { Module } from "@nestjs/common";
import { FontsConfiguration, PdfRendererModule } from "@pdf-generator/pdf-renderer";
import path = require("path");
import { AppController } from "./app.controller";
import { SampleComponentService } from "./components-services/sampleComponent.service";

const OpenSansRegular = Symbol("OpenSansRegular");
export const OpenSansBold = Symbol("OpenSansBold");

const fontsPath = path.join(__dirname, "assets", "fonts", "OpenSans");

const fontsConfiguration: FontsConfiguration = {
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

@Module({
    imports: [PdfRendererModule.register({ fontsConfiguration })],
    controllers: [AppController],
    providers: [SampleComponentService],
})
export class AppModule {}
