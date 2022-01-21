import React = require("react");
import {
    InvoiceTemplate,
    LocalizationOptions,
    InvoiceItemsTableData,
    TaxesData,
    TaxesTableLabels,
    InvoiceTemplateValues,
    InvoiceItemsTableLabels,
} from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvoiceTemplateService {
    getComponent() {
        return (
            <InvoiceTemplate
                invoiceItemsTableData={invoiceItemsTableData}
                invoiceItemsTableLabels={invoiceItemsTableLabels}
                invoiceValues={invoiceValues}
                localizationOptions={localizationOptions}
                taxesData={taxesData}
                taxesTableLabels={taxesLabels}
            />
        );
    }
}

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

const taxesLabels: TaxesTableLabels = {
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

const invoiceValues: InvoiceTemplateValues = {
    invoiceTitle: "Faktura nr FV 1/2055",
    documentDate: new Date(),
    sellDate: new Date(),
    dueDate: new Date(),
    paymentMethod: "przelew",
    seller: (
        <>
            nazwa
            <br />
            ulica
            <br />
            miasto
            <br />
            nip
            <br />
            numer konta
        </>
    ),
    buyer: (
        <>
            nazwa
            <br />
            ulica
            <br />
            miasto
            <br />
            nip
        </>
    ),
};
