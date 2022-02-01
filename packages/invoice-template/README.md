# invoice-template

Invoice templates created with react.

## InvoiceBase

Basic template component creates a document with logo, dates, seller and buyer info, and summary.

```ts
type InvoiceBaseProps = {
    localizationOptions: LocalizationOptions;
    invoiceValues: InvoiceValues;
    invoiceItemsTable: TableDataProp;
    taxesTable?: TableDataProp;
};

type LocalizationOptions = {
    locale: string;
    currency: string;
    dateFormat: string;
    documentDateLabel: string;
    sellDateLabel: string;
    dueDateLabel: string;
    paymentMethodLabel: string;
    sellerLabel: string;
    buyerLabel: string;
    totalLabel: string;
};

type InvoiceValues = {
    logo?: ReactNode;
    invoiceTitle: ReactNode;
    documentDate: Date;
    sellDate: Date;
    dueDate: Date;
    paymentMethod: ReactNode;
    seller: ReactNode;
    buyer: ReactNode;
    total: ReactNode;
};

type TableDataProp = {
    columns: TableColumns;
    data: TableData;
};

type TableColumns = {
    title: string;
    dataIndex: string;
    alignment?: "left" | "center" | "right";
    width?: string;
}[];

type TableData = Record<string, string>[];
```

##### InvoiceBaseProps

The type of component's props.

##### LocalizationOptions

Info about the

-   locale (eg. `en_EN`, learn more about locales
    [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl))
-   currency, currency code (eg. `EUR`, [list](https://www.techonthenet.com/js/currency_codes.php))
-   date format, use the format compatible with [date-fns documentation](https://date-fns.org/v2.28.0/docs/format)
-   all the labels texts

##### InvoiceValues

Values of all the fields and a logo.

##### TableDataProp

Takes columns and data (rows). Elements of `TableData` array consist of key-value pairs, where key should be equal to
the `dataIndex` of chosen column.

### InvoiceBase example

```ts
<InvoiceBase
    invoiceItemsTable={invoiceItemsTable}
    invoiceValues={invoiceValues}
    localizationOptions={localizationOptions}
/>;

const localizationOptions: LocalizationOptions = {
    locale: "en-EN",
    currency: "EUR",
    dateFormat: "yyyy-MM-d",
    documentDateLabel: "Document date:",
    sellDateLabel: "Sell date:",
    dueDateLabel: "Due date:",
    paymentMethodLabel: "Payment method:",
    sellerLabel: "Seller",
    buyerLabel: "Buyer",
    totalLabel: "Total:",
};

const invoiceValues: InvoiceValues = {
    invoiceTitle: "Invoice 123/2020",
    documentDate: new Date(),
    sellDate: new Date(),
    dueDate: new Date(),
    paymentMethod: "cash",
    seller: "name",
    buyer: "name",
    total: "€14,999.00",
};

const invoiceItemsTable: TableDataProp = {
    columns: [
        {
            title: "Index",
            dataIndex: "index",
            alignment: "right",
            width: "18pt",
        },
        {
            title: "Name",
            dataIndex: "name",
            alignment: "left",
        },
    ],
    data: [
        {
            index: "1",
            name: "name 1",
        },
        {
            index: "2",
            name: "name 2",
        },
    ],
};
```

## InvoiceTemplate

Extended version of InvoiceBase, it takes info about taxes, creates the table out of it, and calculates all the values
automatically.

```ts
type InvoiceTemplateProps = {
    localizationOptions: LocalizationOptions;
    invoiceItemsTableData: InvoiceItemsTableData;
    taxesData: TaxesData;
    invoiceItemsTableLabels: InvoiceItemsTableLabels;
    taxesTableLabels: TaxesTableLabels;
    invoiceValues: InvoiceTemplateValues;
};

type InvoiceItemsTableData = {
    name: string;
    count: number;
    priceEach: number;
    taxKey: string;
}[];

type InvoiceItemsTableLabels = {
    index: string;
    name: string;
    unit: string;
    count: string;
    netValueEach: string;
    taxRate: string;
    netValue: string;
    grossValue: string;
};

type TaxesData = Record<string, number>;

type TaxesTableLabels = {
    taxRate: string;
    netValue: string;
    taxValue: string;
    grossValue: string;
    total: string;
};

type InvoiceTemplateValues = Omit<InvoiceValues, "total">;
```

##### InvoiceItemsTableData

Data for invoice items table, `taxKey` should be one of the keys specified in `TaxesData`.

##### TaxesData

Keeps percentage values of taxes.

##### InvoiceItemsTableLabels and TaxesTableLabels

Labels for both of the columns.

##### InvoiceTemplateValues

Same as `InvoiceValues`, but without a `total` field, since total is being calculated.

### InvoiceTemplate example

```ts
<InvoiceTemplate
    invoiceItemsTableData={invoiceItemsTableData}
    invoiceItemsTableLabels={invoiceItemsTableLabels}
    invoiceValues={invoiceValues}
    localizationOptions={localizationOptions}
    taxesData={taxesData}
    taxesTableLabels={taxesLabels}
/>;

const invoiceItemsTableData: InvoiceItemsTableData = [
    {
        name: "name1",
        count: 10,
        priceEach: 150.0,
        taxKey: "tax1",
    },
    {
        name: "name2",
        count: 10,
        priceEach: 200.0,
        taxKey: "tax1",
    },
    {
        name: "name3",
        count: 5,
        priceEach: 100.0,
        taxKey: "tax2",
    },
];

const taxesData: TaxesData = {
    tax1: 23,
    tax2: 50,
};

const invoiceItemsTableLabels = {
    index: "Index",
    name: "Name",
    unit: "Unit",
    count: "Count",
    netValueEach: "Net value each",
    taxRate: "Tax reate",
    netValue: "Net value",
    grossValue: "Gross value",
};

const taxesLabels: TaxesTableLabels = {
    taxRate: "Tax rate",
    netValue: "Net value",
    taxValue: "Tax value",
    grossValue: "Gross value",
    total: "Total",
};

const localizationOptions: LocalizationOptions = {
    locale: "en-EN",
    currency: "EUR",
    dateFormat: "yyyy-MM-d",
    documentDateLabel: "Document date:",
    sellDateLabel: "Sell date:",
    dueDateLabel: "Due date:",
    paymentMethodLabel: "Payment method:",
    sellerLabel: "Seller",
    buyerLabel: "Buyer",
    totalLabel: "Total:",
};

const invoiceValues: InvoiceTemplateValues = {
    invoiceTitle: "Invoice 123/2020",
    documentDate: new Date(),
    sellDate: new Date(),
    dueDate: new Date(),
    paymentMethod: "cash",
    seller: "name",
    buyer: "name",
};
```

### PolishInvoiceTemplate

This template only formats numbers, but does not calculate taxes, those should be calculated on your app's side. The
purpose of the template is to provide basic invoice with labels in polish language.

```ts
export type PolishInvoiceTemplateProps = {
    header: PolishInvoiceHeader;
    seller: SellerBuyerData;
    buyer: SellerBuyerData;
    itemsTable: PolishInvoiceTableItem[];
    taxesTable: PolishInvoiceTax[];
    total: PolishInvoiceTotal;
};

export type PolishInvoiceHeader = {
    dateFormat: string;
    logo?: ReactNode;
    documentDate: Date;
    sellDate: Date;
    dueDate: Date;
    title: string;
    subtitle: string;
};

export type PolishInvoiceTableItem = {
    name: string;
    count: number;
    unit: string;
    netPrice: number;
    vatRate: string;
    netValue: number;
    vatValue: number;
    grossValue: number;
};

export type PolishInvoiceTax = {
    vatRate: string;
    netto: number;
    vat: number;
    brutto: number;
};

export type PolishInvoiceTotal = {
    currency: string;
    totalValue: number;
    inWords: string;
};
```

#### Working with [pdf-renderer](/packages/pdf-renderer)

The template delivers a `polishInvoiceFontsConfig` object, which makes fonts configuration easier.

You have to provide your fonts into PdfRendererModule's register method: regular and bold versions. You should use the
`moduleConfig` method of `polishInvoiceFontsConfig` for this purpose. It's suggested to use Open Sans, which can be
found in the Sample Project. You can pass either a `string` with the path or a `Buffer`.

```ts
PdfRendererModule.register({
    fontsConfiguration: polishInvoiceFontsConfig.moduleConfig({
        regular: path.join(fontsPath, "open-sans-v17-latin-ext-regular.woff"),
        bold: path.join(fontsPath, "open-sans-v17-latin-ext-600.woff"),
    }),
}),
```

To make the fonts available for the component, pass those into the renderer from `polishInvoiceFontsConfig`'s
`pdfRendererConfig` field.

```ts
const stream = await this.pdfRenderer
    .generatePdf(this.polishInvoiceTemplateService.getComponent(), polishInvoiceFontsConfig.pdfRendererConfig)
    .asStream();
```

### PolishInvoiceTemplate example

```ts
const logo = fs.readFileSync(path.join(__dirname, "assets", "logo.png"));

<PolishInvoiceTemplate
    buyer={buyer}
    header={{ ...header, logo: <Logo src={`data:image/png;base64,${logo.toString("base64")}`} /> }}
    itemsTable={itemsTable}
    seller={seller}
    taxesTable={taxesTable}
    total={total}
/>;

const Logo = styled.img`
    width: 90%;
`;

const header: PolishInvoiceHeader = {
    dateFormat: "yyyy-MM-dd",
    documentDate: new Date("2022-01-20"),
    sellDate: new Date("2022-01-20"),
    dueDate: new Date("2022-01-25"),
    title: "Faktura nr 202201/32",
    subtitle: "Zgodnie z umową z dn. 22.08.2021",
};

const seller: SellerBuyerData = {
    name: "LEANCODE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
    addressLine1: "ul. Wróbla 8A",
    addressLine2: "02-736 Warszawa, Polska",
    taxId: "7010616433",
};

const buyer: SellerBuyerData = {
    name: "Jan Kowal",
    addressLine1: "ul. Szpaka 1",
    addressLine2: "00-001 Warszawa",
    taxId: "1234656388",
    additionalFields: [
        {
            label: "e-mail:",
            value: "poczta@gmail.com",
        },
    ],
};

const itemsTable: PolishInvoiceTableItem[] = [
    {
        name: "Audyt aplikacji mobilnej",
        count: 1,
        unit: "szt",
        netPrice: 1500,
        netValue: 1500,
        vatRate: "8%",
        vatValue: 120,
        grossValue: 1620,
    },
    {
        name: "Laptop Lenovo",
        count: 1,
        unit: "szt",
        netPrice: 2000,
        netValue: 2000,
        vatRate: "23%",
        vatValue: 460,
        grossValue: 2460,
    },
];

const taxesTable: PolishInvoiceTax[] = [
    {
        vatRate: "8%",
        netto: 1500,
        vat: 120,
        brutto: 1620,
    },
    {
        vatRate: "23%",
        netto: 2000,
        vat: 460,
        brutto: 2460,
    },
    {
        vatRate: "Razem",
        netto: 3500,
        vat: 580,
        brutto: 4080,
    },
];

const total: PolishInvoiceTotal = {
    totalValue: 4080,
    currency: "PLN",
    inWords: "cztery tysiące osiemdziesiąt",
};
```

![polish invoice](/polish-invoice-example.jpg)
