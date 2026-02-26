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
}
```

```ts
const html = PdfRenderer.generatePdf(React.createElement("div"), []).asHtml();
```

#### Renderer usage example

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
    print-color-adjust: exact;
`;
```

### PDF Signing

The module supports digitally signing PDF documents using P12/PFX certificates. The `PdfSigner` service is exported from
the module and can be used standalone, or you can use the convenient `asSignedBuffer` / `asSignedStream` methods returned
by `generatePdf`.

#### Signing via `generatePdf`

The `generatePdf` method returns `asSignedBuffer` and `asSignedStream` in addition to the unsigned variants. Both accept
a `SignPdfOptions` object:

```ts
import { PdfRenderer, SignPdfOptions } from "@leancodepl/pdf-renderer";
import { readFileSync } from "fs";

@Controller("pdf-renderer")
export class AppController {
    constructor(private readonly pdfRenderer: PdfRenderer) {}

    @Get("signedPdf")
    async signedPdf(@Res() res: Response) {
        const signOptions: SignPdfOptions = {
            p12Buffer: readFileSync("/path/to/certificate.p12"),
            passphrase: "cert-password",
            name: "John Doe",
            reason: "Document approval",
            location: "Warsaw, Poland",
            contactInfo: "john@example.com",
        };

        const stream = await this.pdfRenderer
            .generatePdf({ element: <SampleComponent />, fonts: [OpenSansRegular] })
            .asSignedStream(signOptions);

        res.header("Content-Type", "application/pdf");
        res.header("Content-Disposition", 'attachment; filename="signed.pdf"');

        stream.pipe(res);
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
     * When not provided, the signature is placed at the top of the last page,
     * stretched across the full width.
     * Set to [0, 0, 0, 0] to make the signature invisible.
     */
    widgetRect?: [number, number, number, number];
    /**
     * When true, uses the ETSI.CAdES.detached SubFilter for PAdES
     * (PDF Advanced Electronic Signatures) instead of the default
     * adbe.pkcs7.detached.
     * @default false
     */
    pades?: boolean;
    /**
     * Label text shown above the signer name in the visible signature widget.
     * @default "Digitally signed by"
     */
    signatureLabel?: string;
    /**
     * Pre-rendered PNG image buffer for a custom signature appearance.
     * When provided, this image is embedded in the signature widget instead of
     * the default operator-based text appearance.
     */
    signatureImage?: Buffer;
};
```

#### Visible signature appearance

By default, the signature widget renders a text-based appearance showing the signer's name, date, and reason. You can
customize this in three ways:

1. **Default appearance** - a built-in text layout with the signer name, label, date, and optional reason.
2. **Custom React component** - pass a `signature` component to `generatePdf`. It receives `SignatureAppearanceProps`
   and is rendered to a PNG image that replaces the default text appearance.
3. **Pre-rendered image** - pass a `signatureImage` buffer (PNG) in `SignPdfOptions` to use an arbitrary image.

##### Custom signature component example

```ts
import { SignatureAppearanceProps } from "@leancodepl/pdf-renderer";

const CustomSignature: React.FC<SignatureAppearanceProps> = ({ name, date, reason }) => (
    <div style={{ padding: 10, border: "1px solid gray", fontFamily: "Open Sans" }}>
        <strong>{name}</strong>
        <div>{date}</div>
        {reason && <div>Reason: {reason}</div>}
    </div>
);

// Pass it to generatePdf:
const stream = await pdfRenderer
    .generatePdf({
        element: <SampleComponent />,
        fonts: [OpenSansRegular],
        signature: CustomSignature,
        signatureFonts: [OpenSansRegular], // optional, falls back to fonts
    })
    .asSignedStream(signOptions);
```

#### Using `PdfSigner` directly

You can also inject and use the `PdfSigner` service directly for more control:

```ts
import { PdfSigner, SignPdfOptions } from "@leancodepl/pdf-renderer";

@Injectable()
export class MyService {
    constructor(private readonly pdfSigner: PdfSigner) {}

    async signExistingPdf(pdfBuffer: Buffer, options: SignPdfOptions): Promise<Buffer> {
        return this.pdfSigner.sign(pdfBuffer, options);
    }
}
```

The `sign` method appends a new page with the signature widget and applies the digital signature.

#### Invisible signatures

To create a digitally signed PDF without a visible signature widget, set `widgetRect` to `[0, 0, 0, 0]`:

```ts
const signedBuffer = await pdfRenderer
    .generatePdf({ element: <SampleComponent /> })
    .asSignedBuffer({
        ...signOptions,
        widgetRect: [0, 0, 0, 0],
    });
```

### Styles

For styling your PDF you should use styled components.


### Common issues

| Issue | Solution |
|-------|----------|
| The background color is not printed correctly | Add `print-color-adjust: exact;` to the styled component |


### Docker

At the top of your own Dockerfile add the following line.

`FROM ghcr.io/leancodepl/pdf-generator:[version]`

You can also easily get the current version, by using `latest`.

`FROM ghcr.io/leancodepl/pdf-generator:latest`
