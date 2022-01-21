import * as React from "react";
import { ReactNode, FunctionComponent } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import LabeledField from "../common/LabeledField";
import Table, { TableProps } from "../common/Table";

const invoiceItemsTableClassName = "main-table";
const taxesTableClassName = "taxes-table";

export type TableDataProp = Omit<TableProps, "className">;

export type LocalizationOptions = {
    locale: string;
    currency: string;
    dateFormat: string;
    documentDateLabel: string;
    saleDateLabel: string;
    dueDateLabel: string;
    paymentMethodLabel: string;
    sellerLabel: string;
    buyerLabel: string;
    totalLabel: string;
};

export type InvoiceValues = {
    logo?: ReactNode;
    invoiceName: ReactNode;
    documentDate: Date;
    saleDate: Date;
    dueDate: Date;
    paymentMethod: ReactNode;
    seller: ReactNode;
    buyer: ReactNode;
    total: ReactNode;
};

export type InvoiceBaseProps = {
    localizationOptions: LocalizationOptions;
    invoiceValues: InvoiceValues;
    invoiceItemsTable: TableDataProp;
    taxesTable?: TableDataProp;
};

export const InvoiceBase: FunctionComponent<InvoiceBaseProps> = ({
    localizationOptions: {
        dateFormat,
        documentDateLabel,
        saleDateLabel,
        dueDateLabel,
        paymentMethodLabel,
        sellerLabel,
        buyerLabel,
        totalLabel,
    },
    invoiceValues: { logo, invoiceName, documentDate, saleDate, dueDate, paymentMethod, seller, buyer, total },
    invoiceItemsTable,
    taxesTable,
}) => (
    <Root>
        <LogoWrapper>{logo}</LogoWrapper>
        <TitleWrapper>
            <Name>{invoiceName}</Name>
            <DocumentDate label={documentDateLabel} orientation="horizontal" value={format(documentDate, dateFormat)} />
            <SaleDate label={saleDateLabel} orientation="horizontal" value={format(saleDate, dateFormat)} />
            <DueDate label={dueDateLabel} orientation="horizontal" value={format(dueDate, dateFormat)} />
            <PaymentMethod label={paymentMethodLabel} orientation="horizontal" value={paymentMethod} />
        </TitleWrapper>
        <SellerWrapper label={<b>{sellerLabel}</b>} marginTop="large" orientation="vertical" value={seller} />
        <BuyerWrapper label={<b>{buyerLabel}</b>} marginTop="large" orientation="vertical" value={buyer} />
        <Table className={invoiceItemsTableClassName} {...invoiceItemsTable} />
        {taxesTable && <Table className={taxesTableClassName} {...taxesTable} />}
        <Total>
            <LabeledField label={totalLabel} orientation="horizontal" value={total} />
        </Total>
    </Root>
);

const Root = styled.div`
    display: grid;
    grid:
        "logo title"
        "seller buyer"
        "invoiceItemsTable invoiceItemsTable"
        "taxesTable total" / 1fr 1fr;
    row-gap: 15pt;

    padding: 45pt 26pt;

    font-size: 10pt;

    table {
        border: 1pt solid black;
        border-collapse: collapse;

        * {
            border: 1pt solid black;

            font-size: 10pt;
        }
    }

    .${invoiceItemsTableClassName} {
        grid-area: invoiceItemsTable;

        margin-top: 30pt;
    }

    .${taxesTableClassName} {
        grid-area: taxesTable;
    }
`;

const LogoWrapper = styled.div`
    grid-area: logo;
`;

const TitleWrapper = styled.div`
    grid-area: title;

    display: grid;
    grid:
        "name name"
        "documentDate saleDate"
        "dueDate payment" / 1fr 1fr;
    column-gap: 15pt;
    row-gap: 12pt;
`;

const Name = styled.div`
    grid-area: name;

    width: 100%;

    text-align: center;

    font-size: 12pt;
`;

const DocumentDate = styled(LabeledField)`
    grid-area: documentDate;
`;

const SaleDate = styled(LabeledField)`
    grid-area: saleDate;
`;

const DueDate = styled(LabeledField)`
    grid-area: dueDate;
`;

const PaymentMethod = styled(LabeledField)`
    grid-area: payment;
`;

const SellerWrapper = styled(LabeledField)`
    grid-area: seller;
`;

const BuyerWrapper = styled(LabeledField)`
    grid-area: buyer;
`;

const Total = styled.div`
    grid-area: total;

    width: 25vw;

    margin-left: auto;
`;
