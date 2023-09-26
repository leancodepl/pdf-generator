import {
    PolishInvoiceHeader,
    PolishInvoiceService,
    PolishInvoiceTableItem,
    PolishInvoiceTax,
    PolishInvoiceTotal,
    SellerBuyerData,
} from "@leancodepl/invoice-template";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import path = require("path/posix");
import styled from "styled-components";

@Injectable()
export class PolishInvoiceTemplateService {
    constructor(private readonly polishInvoiceService: PolishInvoiceService) {}

    getRender() {
        const logo = fs.readFileSync(path.join(__dirname, "assets", "lncd-logo.png"));

        return this.polishInvoiceService.renderInvoice({
            header: { ...header, logo: <Logo src={`data:image/png;base64,${logo.toString("base64")}`} /> },
            seller,
            buyer,
            itemsTable,
            taxesTable,
            total,
        });
    }

    getRenderScreenshot() {
        const logo = fs.readFileSync(path.join(__dirname, "assets", "lncd-logo.png"));

        return this.polishInvoiceService.renderInvoiceImage({
            header: { ...header, logo: <Logo src={`data:image/png;base64,${logo.toString("base64")}`} /> },
            seller,
            buyer,
            itemsTable,
            taxesTable,
            total,
        });
    }
}

const Logo = styled.img`
    width: 90%;

    filter: invert(1);

    margin-top: -30pt;
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
