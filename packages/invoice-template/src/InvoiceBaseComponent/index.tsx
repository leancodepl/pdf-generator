import * as React from "react";
import { Moment } from "moment";
import styled from "styled-components";
import LabeledField from "../common/LabeledField";
import Table from "../common/Table";

const mainTableClassName = "main-table";

export type LabeledField<T> = {
    label: string;
    value: T;
};

export type LocalizatonOptions = {
    dateFormat: string;
    documentDate: LabeledField<Moment>;
    sellDate: LabeledField<Moment>;
    dueDate: LabeledField<Moment>;
    paymentMethod: LabeledField<React.ReactNode>;
    seller: LabeledField<React.ReactElement>;
    buyer: LabeledField<React.ReactElement>;
    total: LabeledField<React.ReactNode>;
};

type InvoiceBaseComponentProps = {
    logo: React.ReactElement;
    name: React.ReactNode;
    localizatonOptions: LocalizatonOptions;
};

export const InvoiceBaseComponent: React.FunctionComponent<InvoiceBaseComponentProps> = ({
    logo,
    name,
    localizatonOptions: { dateFormat, documentDate, sellDate, dueDate, paymentMethod, seller, buyer, total },
}) => (
    <Root>
        <LogoWrapper>{logo}</LogoWrapper>
        <TitleWrapper>
            <Name>{name}</Name>
            <DocumentDate
                label={documentDate.label}
                orientation="horizontal"
                value={documentDate.value.format(dateFormat)}
            />
            <SellDate label={sellDate.label} orientation="horizontal" value={sellDate.value.format(dateFormat)} />
            <DueDate label={dueDate.label} orientation="horizontal" value={dueDate.value.format(dateFormat)} />
            <PaymentMethod label={paymentMethod.label} orientation="horizontal" value={paymentMethod.value} />
        </TitleWrapper>
        <SellerWrapper label={<b>{seller.label}</b>} margin="40px 0 0 0" orientation="vertical" value={seller.value} />
        <BuyerWrapper label={<b>{buyer.label}</b>} margin="40px 0 0 0" orientation="vertical" value={buyer.value} />
        <MainTable
            className={mainTableClassName}
            columns={[
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
            ]}
            data={[
                {
                    lp: "1",
                    name: "nazwa1",
                },
                {
                    lp: "2",
                    name: "nazwa2",
                },
            ]}
        />
        <Total>
            <LabeledField label={total.label} orientation="horizontal" value={total.value} />
        </Total>
    </Root>
);

const Root = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    row-gap: 20px;

    padding: 60px 35px;

    font-size: 13px;

    .${mainTableClassName} {
        grid-column: 1 / -1;
        grid-row: 3;

        margin-top: 40px;

        border: 1px solid black;
        border-collapse: collapse;

        * {
            border: 1px solid black;

            font-size: 13px;
        }
    }
`;

const LogoWrapper = styled.div`
    grid-column: 1;
    grid-row: 1;
`;

const TitleWrapper = styled.div`
    grid-column: 2;
    grid-row: 1;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 3;

    column-gap: 20px;
    row-gap: 16px;
`;

const Name = styled.div`
    grid-column: 1 / -1;
    grid-row: 1;

    width: 100%;

    text-align: center;

    font-size: 16px;
`;

const DocumentDate = styled(LabeledField)`
    grid-column: 1;
    grid-row: 2;
`;

const SellDate = styled(LabeledField)`
    grid-column: 2;
    grid-row: 2;
`;

const DueDate = styled(LabeledField)`
    grid-column: 1;
    grid-row: 3;
`;

const PaymentMethod = styled(LabeledField)`
    grid-column: 2;
    grid-row: 3;
`;

const SellerWrapper = styled(LabeledField)`
    grid-column: 1;
    grid-row: 2;
`;

const BuyerWrapper = styled(LabeledField)`
    grid-column: 2;
    grid-row: 2;
`;

const MainTable = styled(Table)`
    grid-column: 1 / -1;
    grid-row: 3;

    margin-top: 40px;
`;

const Total = styled.div`
    grid-column: 2;
    grid-row: 4;

    width: 25vw;

    margin-left: auto;
`;
