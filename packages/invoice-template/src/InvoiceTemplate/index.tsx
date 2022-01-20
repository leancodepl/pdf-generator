import * as React from "react";
import { FunctionComponent } from "react";
import { InvoiceBase, InvoiceBaseProps } from "..";
import { TableColumns, TableData } from "../common/Table";

export type MainTableRow = {
    name: string;
    count: number;
    priceEach: number;
    taxKey: string;
};

export type MainTableData = MainTableRow[];

export type TaxesData = Record<string, number>;

export type TaxesTableLabels = {
    taxRate: string;
    netValue: string;
    taxValue: string;
    grossValue: string;
    total: string;
};

export type InvoiceLocale = {
    language: string;
    currency: string;
};

type InvoiceTemplateProps = {
    locale: InvoiceLocale;
    mainTableData: MainTableData;
    taxesData: TaxesData;
    taxesTableLabels: TaxesTableLabels;
} & Omit<InvoiceBaseProps, "mainTable" | "taxesTable">;

export const InvoiceTemplate: FunctionComponent<InvoiceTemplateProps> = ({
    locale,
    logo,
    name,
    localizatonOptions,
    mainTableData,
    taxesData,
    taxesTableLabels,
}) => {
    const formatCurrency = (x: number) =>
        x.toLocaleString(locale.language, {
            style: "currency",
            currency: locale.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const { mainTable, taxesTable, total } = createTablesData(
        taxesData,
        mainTableData,
        formatCurrency,
        taxesTableLabels.total,
    );

    return (
        <InvoiceBase
            localizatonOptions={{
                ...localizatonOptions,
                total: { label: localizatonOptions.total.label, value: total },
            }}
            logo={logo}
            mainTable={{ columns: mainTableColumns, data: mainTable }}
            name={name}
            taxesTable={{ columns: getTaxesTableColumns(taxesTableLabels), data: taxesTable }}
        />
    );
};

const createTablesData = (
    taxesData: TaxesData,
    mainTableData: MainTableData,
    formatCurrency: (x: number) => string,
    totalLabel: string,
): { mainTable: TableData; taxesTable: TableData; total: string } => {
    const mainTable: TableData = mainTableData.map((row, index) => {
        const netValue = row.count * row.priceEach;

        return {
            lp: (index + 1).toString(),
            name: row.name,
            unit: "szt.",
            count: row.count.toString(),
            netValueEach: formatCurrency(row.priceEach),
            taxRate: `${taxesData[row.taxKey]}%`,
            netValue: formatCurrency(netValue),
            grossValue: formatCurrency(netValue * (1 + taxesData[row.taxKey] / 100)),
        };
    });

    const totalValues = {
        net: 0,
        tax: 0,
        gross: 0,
    };

    const taxesTable: TableData = Object.entries(taxesData).map(tax => {
        const netValue = mainTableData
            .filter(row => row.taxKey === tax[0])
            .reduce((acc, curr) => (acc += curr.count * curr.priceEach), 0);

        const taxValue = (netValue * tax[1]) / 100;

        totalValues.net += netValue;
        totalValues.tax += taxValue;
        totalValues.gross += netValue + taxValue;

        return {
            taxRate: `${tax[1]}%`,
            netValue: formatCurrency(netValue),
            taxValue: formatCurrency(taxValue),
            grossValue: formatCurrency(netValue + taxValue),
        };
    });

    return {
        mainTable,
        taxesTable: [
            ...taxesTable,
            {
                taxRate: totalLabel,
                netValue: formatCurrency(totalValues.net),
                taxValue: formatCurrency(totalValues.tax),
                grossValue: formatCurrency(totalValues.gross),
            },
        ],
        total: formatCurrency(totalValues.gross),
    };
};

const mainTableColumns: TableColumns = [
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
    {
        title: "Jednostka",
        dataIndex: "unit",
        alignment: "center",
    },
    {
        title: "Ilość",
        dataIndex: "count",
        alignment: "right",
    },
    {
        title: "Cena netto",
        dataIndex: "netValueEach",
        alignment: "right",
    },
    {
        title: "Stawka",
        dataIndex: "taxRate",
        alignment: "right",
    },
    {
        title: "Wartość netto",
        dataIndex: "netValue",
        alignment: "right",
    },
    {
        title: "Wartość brutto",
        dataIndex: "grossValue",
        alignment: "right",
    },
];

const getTaxesTableColumns = (taxesTableLables: TaxesTableLabels): TableColumns => [
    {
        title: taxesTableLables["taxRate"],
        dataIndex: "taxRate",
        alignment: "center",
        width: "25%",
    },
    {
        title: taxesTableLables["netValue"],
        dataIndex: "netValue",
        alignment: "right",
        width: "25%",
    },
    {
        title: taxesTableLables["taxValue"],
        dataIndex: "taxValue",
        alignment: "right",
        width: "25%",
    },
    {
        title: taxesTableLables["grossValue"],
        dataIndex: "grossValue",
        alignment: "right",
        width: "25%",
    },
];
