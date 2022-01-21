import React = require("react");
import { InvoiceBase, InvoiceValues, LocalizationOptions, TableDataProp } from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BaseInvoiceService {
    getComponent() {
        return (
            <InvoiceBase
                invoiceItemsTable={invoiceItemsTable}
                invoiceValues={invoiceValues}
                localizationOptions={localizationOptions}
            />
        );
    }
}

const localizationOptions: LocalizationOptions = {
    locale: "en-EN",
    currency: "EUR",
    dateFormat: "yyyy-MM-d",
    documentDateLabel: "Data wystawienia:",
    saleDateLabel: "Data sprzedaży:",
    dueDateLabel: "Termin płatności:",
    paymentMethodLabel: "Metoda płatności:",
    sellerLabel: "Sprzedawca",
    buyerLabel: "Nabywca",
    totalLabel: "Suma:",
};

const invoiceValues: InvoiceValues = {
    invoiceName: "Faktura nr FV 1/2055",
    documentDate: new Date(),
    saleDate: new Date(),
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
            number konta
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
    total: "14 999,00 PLN",
};

const invoiceItemsTable: TableDataProp = {
    columns: [
        {
            title: "Lp",
            dataIndex: "lp",
            alignment: "right",
            width: "18pt",
        },
        {
            title: "Nazwa",
            dataIndex: "name",
            alignment: "left",
        },
    ],
    data: [
        {
            lp: "1",
            name: "nazwa1",
        },
        {
            lp: "2",
            name: "nazwa2",
        },
    ],
};
