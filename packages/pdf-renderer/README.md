# pdf-renderer

pdf-renderer is a NestJS module used for creating PDF files out of react components.

## Installation

```
npm install @leancodepl/pdf-renderer
yarn add @leancodepl/pdf-renderer
```

## Prerequisites

For the pdf-renderer to run correctly, it is required to use Dockerfile delivered with a package, which installs all of
the dependencies needed by Puppeteer.

If you want to provide custom fonts, you need those in the `.woff` format, which is the only one supported at the
moment.

Keep in mind, that everything you pass into the renderer, has to be synchronous, for it to work as expected. Any data
component needs, should be provided beforehand. Also, calling some hooks inside a component may not work as intended.

## Usage

To use pdf-renderer you have to register it inside a module of your own NestJS app. Register takes a single argument, an
object with a `fontsConfiguration` field. If needed, `FontsConfiguration` type can be imported from the package.

```
import { PdfRendererModule, FontsConfiguration } from "@leancodepl/pdf-renderer";

export const OpenSansRegular = Symbol("OpenSansRegular");

const fontsPath = path.join(__dirname, "path_to_fonts_folder");

const fontsConfiguration: FontsConfiguration = {
    [OpenSansRegular]: {
        fontFile: path.join(fontsPath, "open-sans-v17-latin-ext-regular.woff"),
        fontFamily: "Open Sans",
        fontStyle: "normal",
        fontWeight: 400,
    }
};

@Module({
    imports: [PdfRendererModule.register({ fontsConfiguration })]
    controllers: [AppController],
})
```

#### Fonts configuration

You can use both `Symbol` and `string` as font's key. `fontFile` should be a `string` containing a path or a `Buffer`.

#### generatePdf

You can generate a PDF by passing react component and array of fonts' keys, which you defined in the fontsConfiguration
(passing an incorrect key will result in an exception being thrown) to generatePdf method. Method call can be followed
with one of the returned functions, to choose the format of data returned by the renderer.

```
PdfRenderer.generatePdf(element: ReactElement, fonts?: (symbol | string)[]): {
    asHtml: () => string;
    asBuffer: () => Promise<Buffer>;
    asStream: () => Promise<Readable>;
}
```

```
const html = PdfRenderer.generatePdf(React.createElement("div"), []).asHtml();
```

#### Renderer consumption example

As an example, you can inject the PdfRenderer service into your controller and make the PDF file downloadable.

```
import { PdfRenderer } from "@leancodepl/pdf-renderer";

@Controller("pdf-renderer")
export class AppController {
    constructor(private readonly pdfRenderer: PdfRenderer) {}

    @Get("samplePdf")
    async samplePdf(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(React.createElement("div"), [OpenSansRegular]).asStream();

        const filename = "sample.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}
```

### Styles

For styling your PDF you should use styled components.
