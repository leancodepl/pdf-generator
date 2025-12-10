import { PolishInvoiceTableItem, PolishInvoiceTax } from "."
import { TableColumns } from "../common/Table"

export const usePolishInvoiceTemplate = ({
  itemsTable,
  taxesTable,
}: {
  itemsTable: PolishInvoiceTableItem[]
  taxesTable: PolishInvoiceTax[]
}) => ({
  formattedItemsTable: formatItemsTable(itemsTable),
  formattedTaxesTable: formatTaxesTable(taxesTable),
  itemsColumns,
  taxesColumns,
  formatNumber,
})

const formatNumber = (n: number) =>
  n.toLocaleString("PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const formatItemsTable = (itemsTable: PolishInvoiceTableItem[]) =>
  itemsTable.map((item, index) => ({
    ...item,
    index: `${index + 1}.`,
    count: formatNumber(item.count),
    netPrice: formatNumber(item.netPrice),
    netValue: formatNumber(item.netValue),
    vatValue: formatNumber(item.vatValue),
    grossValue: formatNumber(item.grossValue),
  }))

const formatTaxesTable = (taxesTable: PolishInvoiceTax[]) =>
  taxesTable.map(({ vatRate, netto, vat, brutto }) => ({
    vatRate,
    netto: formatNumber(netto),
    vat: formatNumber(vat),
    brutto: formatNumber(brutto),
  }))

const itemsColumns: TableColumns = [
  {
    title: "lp.",
    dataIndex: "index",
    alignment: "left",
  },
  {
    title: "Nazwa towaru/usługi",
    dataIndex: "name",
    alignment: "left",
  },
  {
    title: "Ilość",
    dataIndex: "count",
    alignment: "right",
  },
  {
    title: "Jm",
    dataIndex: "unit",
    alignment: "center",
  },
  {
    title: "Cena netto",
    dataIndex: "netPrice",
    alignment: "right",
  },
  {
    title: "VAT",
    dataIndex: "vatRate",
    alignment: "center",
  },
  {
    title: "Kwota netto",
    dataIndex: "netValue",
    alignment: "right",
  },
  {
    title: "Kwota VAT",
    dataIndex: "vatValue",
    alignment: "right",
  },
  {
    title: "Kwota brutto",
    dataIndex: "grossValue",
    alignment: "right",
  },
]

const taxesColumns: TableColumns = [
  {
    title: "Stawka VAT",
    dataIndex: "vatRate",
    alignment: "right",
  },
  {
    title: "Netto",
    dataIndex: "netto",
    alignment: "right",
  },
  {
    title: "VAT",
    dataIndex: "vat",
    alignment: "right",
  },
  {
    title: "Brutto",
    dataIndex: "brutto",
    alignment: "right",
  },
]
