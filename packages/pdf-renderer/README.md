# pdf-renderer

pdf-renderer is a NestJS module used for creating PDF files out of react components. It also supports digitally signing
PDFs using P12/PFX certificates.

## Installation

```
npm install @leancodepl/pdf-renderer
yarn add @leancodepl/pdf-renderer
```

## Prerequisites

For the pdf-renderer to run correctly, it is required to use Dockerfile delivered with a package, which installs all of
the dependencies needed by Puppeteer.

You should provide your own fonts, because using one of the basic ones may result in inconsistent behavior across
different operating systems. You need those in the `.woff` format, which is the only one supported at the moment. If not
provided, the font will be set to `chromium`'s default.

Keep in mind, that everything you pass into the renderer, **has to be synchronous**, for it to work as expected. Any
data component needs, should be provided beforehand. Also, calling some hooks inside a component may not work as
intended.

## Usage

To use pdf-renderer you have to register it inside a module of your own NestJS app. Register takes a single argument, an
object with a `fontsConfiguration` field. If needed, `FontsConfiguration` type can be imported from the package.

```ts
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

### Configuration

```ts
type PdfRendererConfiguration = {
    isGlobal?: boolean;
    fontsConfiguration: FontsConfiguration;
};
```

##### Registering a module globally

You can specify if you want to register the module globally. Not specifying makes the module global by default.

##### Fonts configuration

You can use both `Symbol` and `string` as font's key. `fontFile` should be a `string` containing a path or a `Buffer`.

#### generatePdf

You can generate a PDF by passing react component and array of fonts' keys, which you defined in the fontsConfiguration
(passing an incorrect key will result in an exception being thrown) to generatePdf method. Method call can be followed
with one of the returned functions, to choose the format of data returned by the renderer.

```ts
PdfRenderer.generatePdf(element: ReactElement, fonts?: (symbol | string)[]): {
    asHtml: () => string;
    asBuffer: () => Promise<Buffer>;
    asStream: () => Promise<Readable>;
    asSignedBuffer: (signOptions: SignPdfOptions) => Promise<Buffer>;
    asSignedStream: (signOptions: SignPdfOptions) => Promise<Readable>;
}
```

```ts
const html = PdfRenderer.generatePdf(React.createElement("div"), []).asHtml();
```

#### Renderer consumption example

As an example, you can inject the PdfRenderer service into your controller and make the PDF file downloadable.

```ts
import { PdfRenderer } from "@leancodepl/pdf-renderer";

@Controller("pdf-renderer")
export class AppController {
    constructor(private readonly pdfRenderer: PdfRenderer) {}

    @Get("samplePdf")
    async samplePdf(@Res() res: Response) {
        const stream = await this.pdfRenderer.generatePdf(<SampleComponent />, [OpenSansRegular]).asStream();

        const filename = "sample.pdf";

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", `attachment; filename="${filename}"`);

        stream.pipe(res);
    }
}

const SampleComponent: React.FunctionComponent = () => <StyledDiv>sample pdf generator component</StyledDiv>;

const StyledDiv = styled.div`
    background: blue;
`;
```

### PDF Signing

The module supports digitally signing PDF documents using P12/PFX certificates. Signing is available both as part of the
`generatePdf` pipeline and as a standalone `PdfSigner` service.

#### Signing via `generatePdf`

The `generatePdf` method returns two additional functions for producing signed PDFs:

- `asSignedBuffer(signOptions)` -- generates and signs the PDF, returning a `Buffer`
- `asSignedStream(signOptions)` -- generates and signs the PDF, returning a `Readable` stream

```ts
import { PdfRenderer, SignPdfOptions } from "@leancodepl/pdf-renderer";
import * as fs from "fs";

const p12Buffer = fs.readFileSync("path/to/certificate.p12");

const signOptions: SignPdfOptions = {
    p12Buffer,
    passphrase: "certificate-password",
    reason: "Document approval",
    name: "John Doe",
    contactInfo: "john@example.com",
    location: "Warsaw, Poland",
};

// As a signed buffer
const signedPdfBuffer = await pdfRenderer
    .generatePdf({ element: <MyComponent />, fonts: [OpenSansRegular] })
    .asSignedBuffer(signOptions);

// As a signed stream
const signedPdfStream = await pdfRenderer
    .generatePdf({ element: <MyComponent />, fonts: [OpenSansRegular] })
    .asSignedStream(signOptions);
```

#### Standalone `PdfSigner` service

You can also inject `PdfSigner` directly to sign any existing PDF buffer. This is useful when you already have a PDF and
want to sign it without going through the rendering pipeline.

```ts
import { PdfSigner, SignPdfOptions } from "@leancodepl/pdf-renderer";

@Controller("pdf-signer")
export class SignController {
    constructor(private readonly pdfSigner: PdfSigner) {}

    @Post("sign")
    async signPdf(@Body() body: { pdf: Buffer }) {
        const signOptions: SignPdfOptions = {
            p12Buffer: fs.readFileSync("path/to/certificate.p12"),
            passphrase: "certificate-password",
            name: "Jane Doe",
            reason: "Approval",
        };

        return this.pdfSigner.sign(body.pdf, signOptions);
    }
}
```

#### `SignPdfOptions`

```ts
type SignPdfOptions = {
    /** P12/PFX certificate bundle as a Buffer */
    p12Buffer: Buffer;
    /** Passphrase for the P12 certificate */
    passphrase?: string;
    /** Reason for signing */
    reason?: string;
    /** Contact information of the signer */
    contactInfo?: string;
    /** Location where the document was signed */
    location?: string;
    /** Name of the signer */
    name?: string;
    /**
     * Maximum length (in bytes) reserved for the PKCS#7 signature.
     * Increase this if signing fails due to a large certificate chain.
     * @default 8192
     */
    signatureMaxLength?: number;
    /**
     * Custom [x1, y1, x2, y2] rectangle for the visible signature widget.
     * When not provided, the signature is placed at the bottom-right of the last page.
     * Set to [0, 0, 0, 0] to make the signature invisible.
     */
    widgetRect?: [number, number, number, number];
};
```

#### Visible signature

By default, signing adds a visible signature widget to the bottom-right corner of the last page. The widget displays the
signer's name, date, and optionally the reason for signing.

To create an invisible signature (no visual mark on the PDF), pass `widgetRect: [0, 0, 0, 0]` in the sign options.

To place the signature at a custom position, provide a `widgetRect` array of `[x1, y1, x2, y2]` coordinates in PDF
points.

### Styles

For styling your PDF you should use styled components.

### Docker

At the top of your own Dockerfile add the following line.

`FROM ghcr.io/leancodepl/pdf-generator:[version]`

You can also easily get the current version, by using `latest`.

`FROM ghcr.io/leancodepl/pdf-generator:latest`
