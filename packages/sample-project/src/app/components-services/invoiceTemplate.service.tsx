import React = require("react");
import {
    InvoiceTemplate,
    LocalizatonOptions,
    MainTableData,
    TaxesData,
    TaxesTableLabels,
} from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";

const taxesData: TaxesData = {
    vat: 23,
    vat2: 50,
};

const localizatonOptions: LocalizatonOptions = {
    dateFormat: "yyyy-MM-d",
    documentDate: {
        label: "Data wystawienia:",
        value: new Date(),
    },
    sellDate: {
        label: "Data sprzedaży:",
        value: new Date(),
    },
    dueDate: {
        label: "Termin płatności:",
        value: new Date(),
    },
    paymentMethod: {
        label: "Metoda płatności:",
        value: "przelew",
    },
    seller: {
        label: "Sprzedawca",
        value: (
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
    },
    buyer: {
        label: "Nabywca",
        value: (
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
    },
    total: {
        label: "Suma:",
        value: "",
    },
};

const taxesLabels: TaxesTableLabels = {
    taxRate: "Stawka VAT",
    netValue: "Wartość netto",
    taxValue: "Kwota VAT",
    grossValue: "Wartość brutto",
    total: "Razem",
};

const mainTableData: MainTableData = [
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

@Injectable()
export class InvoiceTemplateService {
    getComponent() {
        return (
            <InvoiceTemplate
                locale={{ currency: "EUR", language: "en-EN" }}
                localizatonOptions={localizatonOptions}
                logo={<></>}
                mainTableData={mainTableData}
                name="Faktura nr FV 1/2055"
                taxesData={taxesData}
                taxesTableLabels={taxesLabels}
            />
        );
    }
}
