import * as React from "react";
import { ReactNode, FunctionComponent } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import LabeledField from "../common/LabeledField";
import Table, { TableProps } from "../common/Table";

const mainTableClassName = "main-table";
const taxesTableClassName = "taxes-table";

export type TableDataProp = Omit<TableProps, "className">;

export type LabeledField<T> = {
    label: string;
    value: T;
};

export type LocalizatonOptions = {
    dateFormat: string;
    documentDate: LabeledField<Date>;
    sellDate: LabeledField<Date>;
    dueDate: LabeledField<Date>;
    paymentMethod: LabeledField<ReactNode>;
    seller: LabeledField<ReactNode>;
    buyer: LabeledField<ReactNode>;
    total: LabeledField<ReactNode>;
};

export type InvoiceBaseProps = {
    logo: ReactNode;
    name: ReactNode;
    localizatonOptions: LocalizatonOptions;
    mainTable: TableDataProp;
    taxesTable?: TableDataProp;
};

export const InvoiceBase: FunctionComponent<InvoiceBaseProps> = ({
    logo,
    name,
    localizatonOptions: { dateFormat, documentDate, sellDate, dueDate, paymentMethod, seller, buyer, total },
    mainTable,
    taxesTable,
}) => (
    <Root>
        <LogoWrapper>{logo}</LogoWrapper>
        <TitleWrapper>
            <Name>{name}</Name>
            <DocumentDate
                label={documentDate.label}
                orientation="horizontal"
                value={format(documentDate.value, dateFormat)}
            />
            <SellDate label={sellDate.label} orientation="horizontal" value={format(sellDate.value, dateFormat)} />
            <DueDate label={dueDate.label} orientation="horizontal" value={format(dueDate.value, dateFormat)} />
            <PaymentMethod label={paymentMethod.label} orientation="horizontal" value={paymentMethod.value} />
        </TitleWrapper>
        <SellerWrapper label={<b>{seller.label}</b>} margin="30pt 0 0 0" orientation="vertical" value={seller.value} />
        <BuyerWrapper label={<b>{buyer.label}</b>} margin="30pt 0 0 0" orientation="vertical" value={buyer.value} />
        <Table className={mainTableClassName} {...mainTable} />
        {taxesTable && <Table className={taxesTableClassName} {...taxesTable} />}
        <Total>
            <LabeledField label={total.label} orientation="horizontal" value={total.value} />
        </Total>
    </Root>
);

const Root = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    row-gap: 15pt;

    grid-template-areas:
        "logo title"
        "seller buyer"
        "mainTable mainTable"
        "taxesTable total";

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

    .${mainTableClassName} {
        grid-area: mainTable;

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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

    grid-template-areas:
        "name name"
        "documentDate sellDate"
        "dueDate payment";

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

const SellDate = styled(LabeledField)`
    grid-area: sellDate;
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
