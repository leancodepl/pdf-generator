import { InvoiceItemsTableData, InvoiceItemsTableLabels, LocalizationOptions, TaxesData, TaxesTableLabels } from "..";
import { useInvoiceTemplate, UseInvoiceTemplateReturn } from "./useInvoiceTemplate";

const netValueString = "€4,000.00";
const taxValueString = "€1,055.00";
const totalString = "€5,055.00";

describe("useInvoiceTemplate", () => {
    let invoiceTemplate: UseInvoiceTemplateReturn;

    beforeAll(() => {
        invoiceTemplate = useInvoiceTemplate({
            localizationOptions,
            invoiceItemsTableData,
            taxesData,
            invoiceItemsTableLabels,
            taxesTableLabels,
        });
    });

    it("should calculate correct netValue", () => {
        const { data } = invoiceTemplate.taxesTable;

        expect(data[data.length - 1]["netValue"]).toEqual(netValueString);
    });

    it("should calculate correct taxValue", () => {
        const { data } = invoiceTemplate.taxesTable;

        expect(data[data.length - 1]["taxValue"]).toEqual(taxValueString);
    });

    it("should calculate correct total", () => {
        const { data } = invoiceTemplate.taxesTable;

        expect(data[data.length - 1]["grossValue"]).toEqual(totalString);
        expect(invoiceTemplate.total).toEqual(totalString);
    });
});

const invoiceItemsTableData: InvoiceItemsTableData = [
    {
        name: "name1",
        count: 10,
        priceEach: 150.0,
        taxKey: "vat",
    },
    {
        name: "name2",
        count: 10,
        priceEach: 200.0,
        taxKey: "vat",
    },
    {
        name: "name3",
        count: 5,
        priceEach: 100.0,
        taxKey: "vat2",
    },
];

const taxesData: TaxesData = {
    vat: 23,
    vat2: 50,
};

const invoiceItemsTableLabels: InvoiceItemsTableLabels = {
    index: "Lp",
    name: "Nazwa",
    unit: "Jednostka",
    count: "Ilość",
    netValueEach: "Cena netto",
    taxRate: "Stawka",
    netValue: "Wartość netto",
    grossValue: "Wartość brutto",
};

const taxesTableLabels: TaxesTableLabels = {
    taxRate: "Stawka VAT",
    netValue: "Wartość netto",
    taxValue: "Kwota VAT",
    grossValue: "Wartość brutto",
    total: "Razem",
};

const localizationOptions: LocalizationOptions = {
    locale: "en-EN",
    currency: "EUR",
    dateFormat: "yyyy-MM-d",
    documentDateLabel: "Data wystawienia:",
    sellDateLabel: "Data sprzedaży:",
    dueDateLabel: "Termin płatności:",
    paymentMethodLabel: "Metoda płatności:",
    sellerLabel: "Sprzedawca",
    buyerLabel: "Nabywca",
    totalLabel: "Suma:",
};
