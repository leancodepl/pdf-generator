import { InvoiceItemsTableData, InvoiceItemsTableLabels, TaxesData, TaxesTableLabels } from ".";
import { LocalizationOptions, TableDataProp } from "..";
import { TableColumns, TableData } from "../common/Table";

type UseInvoiceTemplateArgs = {
    localizationOptions: LocalizationOptions;
    invoiceItemsTableData: InvoiceItemsTableData;
    taxesData: TaxesData;
    invoiceItemsTableLabels: InvoiceItemsTableLabels;
    taxesTableLabels: TaxesTableLabels;
};

type UseInvoiceTemplateReturn = {
    invoiceItemsTable: TableDataProp;
    taxesTable: TableDataProp;
    total: string;
};

export const useInvoiceTemplate = ({
    localizationOptions,
    invoiceItemsTableData,
    taxesData,
    invoiceItemsTableLabels,
    taxesTableLabels,
}: UseInvoiceTemplateArgs): UseInvoiceTemplateReturn => {
    const formatCurrency = (x: number) =>
        x.toLocaleString(localizationOptions.locale, {
            style: "currency",
            currency: localizationOptions.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const { invoiceItemsTable, taxesTable, total } = createTablesData(
        taxesData,
        invoiceItemsTableData,
        formatCurrency,
        taxesTableLabels.total,
    );

    return {
        invoiceItemsTable: { data: invoiceItemsTable, columns: getInvoiceItemsTableColumns(invoiceItemsTableLabels) },
        taxesTable: { data: taxesTable, columns: getTaxesTableColumns(taxesTableLabels) },
        total,
    };
};

const createTablesData = (
    taxesData: TaxesData,
    invoiceItemsTableData: InvoiceItemsTableData,
    formatCurrency: (x: number) => string,
    totalLabel: string,
): { invoiceItemsTable: TableData; taxesTable: TableData; total: string } => {
    const invoiceItemsTable: TableData = invoiceItemsTableData.map((row, index) => {
        const netValue = row.count * row.priceEach;

        return {
            index: (index + 1).toString(),
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
        const netValue = invoiceItemsTableData
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
        invoiceItemsTable,
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

const getInvoiceItemsTableColumns = (invoiceItemsTableLables: InvoiceItemsTableLabels): TableColumns => [
    {
        title: invoiceItemsTableLables.index,
        dataIndex: "index",
        alignment: "right",
        width: "18pt",
    },
    {
        title: invoiceItemsTableLables.name,
        dataIndex: "name",
        alignment: "left",
        width: "25%",
    },
    {
        title: invoiceItemsTableLables.unit,
        dataIndex: "unit",
        alignment: "center",
    },
    {
        title: invoiceItemsTableLables.count,
        dataIndex: "count",
        alignment: "right",
    },
    {
        title: invoiceItemsTableLables.netValueEach,
        dataIndex: "netValueEach",
        alignment: "right",
    },
    {
        title: invoiceItemsTableLables.taxRate,
        dataIndex: "taxRate",
        alignment: "right",
    },
    {
        title: invoiceItemsTableLables.netValue,
        dataIndex: "netValue",
        alignment: "right",
    },
    {
        title: invoiceItemsTableLables.grossValue,
        dataIndex: "grossValue",
        alignment: "right",
    },
];

const getTaxesTableColumns = (taxesTableLables: TaxesTableLabels): TableColumns => [
    {
        title: taxesTableLables.taxRate,
        dataIndex: "taxRate",
        alignment: "center",
        width: "25%",
    },
    {
        title: taxesTableLables.netValue,
        dataIndex: "netValue",
        alignment: "right",
        width: "25%",
    },
    {
        title: taxesTableLables.taxValue,
        dataIndex: "taxValue",
        alignment: "right",
        width: "25%",
    },
    {
        title: taxesTableLables.grossValue,
        dataIndex: "grossValue",
        alignment: "right",
        width: "25%",
    },
];
