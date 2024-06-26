import { ReactNode, FunctionComponent } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { SellerBuyerComponent, SellerBuyerData } from "./SellerBuyerComponent";
import { usePolishInvoiceTemplate } from "./usePolishInvoiceTemplate";
import LabeledField from "../common/LabeledField";
import Table from "../common/Table";

const taxesTableClassName = "taxes-table";

export type PolishInvoiceHeader = {
    dateFormat: string;
    logo?: ReactNode;
    documentDate: Date;
    sellDate: Date;
    dueDate: Date;
    title: string;
    subtitle: string;
};

export type PolishInvoiceTableItem = {
    name: string;
    count: number;
    unit: string;
    netPrice: number;
    vatRate: string;
    netValue: number;
    vatValue: number;
    grossValue: number;
};

export type PolishInvoiceTax = {
    vatRate: string;
    netto: number;
    vat: number;
    brutto: number;
};

export type PolishInvoiceTotal = {
    currency: string;
    totalValue: number;
    inWords: string;
};

export type PolishInvoiceTemplateProps = {
    header: PolishInvoiceHeader;
    seller: SellerBuyerData;
    buyer: SellerBuyerData;
    itemsTable: PolishInvoiceTableItem[];
    itemsComment?: string;
    taxesTable: PolishInvoiceTax[];
    total: PolishInvoiceTotal;
};

export const PolishInvoiceTemplate: FunctionComponent<PolishInvoiceTemplateProps> = ({
    header: { logo, documentDate, dueDate, sellDate, dateFormat, title, subtitle },
    seller,
    buyer,
    itemsTable,
    itemsComment,
    taxesTable,
    total: { currency, totalValue, inWords },
}) => {
    const { formattedItemsTable, formattedTaxesTable, itemsColumns, taxesColumns, formatNumber } =
        usePolishInvoiceTemplate({ itemsTable, taxesTable });

    return (
        <Root>
            <LogoWrapper>{logo}</LogoWrapper>
            <Header>
                <LabeledField
                    disableAutoLeftMargin
                    label="Data wystawienia: "
                    orientation="horizontal"
                    value={<b>{format(documentDate, dateFormat)}</b>}
                />
                <LabeledField
                    disableAutoLeftMargin
                    label="Data sprzedaży: "
                    orientation="horizontal"
                    value={<b>{format(sellDate, dateFormat)}</b>}
                />
                <LabeledField
                    disableAutoLeftMargin
                    label="Data płatności: "
                    orientation="horizontal"
                    value={<b>{format(dueDate, dateFormat)}</b>}
                />
            </Header>
            <TitleWrapper>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </TitleWrapper>
            <Seller data={seller} type="seller" />
            <Buyer data={buyer} type="buyer" />
            <Items>
                <Table boldLabels columns={itemsColumns} data={formattedItemsTable} />
                {itemsComment && <span>{itemsComment}</span>}
            </Items>
            <Table boldLabels className={taxesTableClassName} columns={taxesColumns} data={formattedTaxesTable} />
            <Total>
                <ToBePaid>
                    Do zapłaty: {formatNumber(totalValue)} {currency}
                </ToBePaid>
                <InWords>
                    Kwota słownie:{" "}
                    <b>
                        {inWords} {currency}
                    </b>
                </InWords>
            </Total>
        </Root>
    );
};

const Root = styled.div`
    font-family: Font;

    display: grid;
    grid:
        "logo header"
        "title title"
        "seller buyer"
        "itemsTable itemsTable"
        "- taxesTable"
        "- total" / 1fr 1fr;
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

    .${taxesTableClassName} {
        grid-area: taxesTable;
    }
`;

const Items = styled.div`
    grid-area: itemsTable;

    margin-top: 30pt;
`;

const LogoWrapper = styled.div`
    grid-area: logo;
`;

const Header = styled.div`
    grid-area: header;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const TitleWrapper = styled.div`
    grid-area: title;
`;

const Title = styled.div`
    font-size: 25pt;
`;

const Subtitle = styled.div``;

const Seller = styled(SellerBuyerComponent)`
    grid-area: seller;
`;

const Buyer = styled(SellerBuyerComponent)`
    grid-area: buyer;
`;

const Total = styled.div`
    grid-area: total;
`;

const ToBePaid = styled.u`
    font-size: 15pt;
    font-weight: bold;
    text-decoration: underline;
`;

const InWords = styled.div`
    margin-top: 16pt;
`;
