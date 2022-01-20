import React = require("react");
import { InvoiceBase, LocalizatonOptions, TableDataProp } from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";

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
        value: "14 999,00 PLN",
    },
};

const mainTable: TableDataProp = {
    columns: [
        {
            title: "Lp",
            dataIndex: "lp",
            alignment: "right",
            width: "22px",
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

@Injectable()
export class BaseInvoiceService {
    getComponent() {
        return (
            <InvoiceBase
                localizatonOptions={localizatonOptions}
                logo={<></>}
                mainTable={mainTable}
                name="Faktura nr FV 1/2055"
            />
        );
    }
}
