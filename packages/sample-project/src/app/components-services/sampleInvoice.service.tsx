import React = require("react");
import { InvoiceBaseComponent, LocalizatonOptions } from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";
import moment = require("moment");

const localizatonOptions: LocalizatonOptions = {
    dateFormat: "YYYY-MM-D",
    documentDate: {
        label: "Data wystawienia:",
        value: moment(),
    },
    sellDate: {
        label: "Data sprzedaży:",
        value: moment(),
    },
    dueDate: {
        label: "Termin płatności:",
        value: moment(),
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
        value: "14 999,00 PLN",
    },
};

@Injectable()
export class SampleInvoiceService {
    getComponent() {
        return (
            <InvoiceBaseComponent localizatonOptions={localizatonOptions} logo={<></>} name="Faktura nr FV 1/2055" />
        );
    }
}
