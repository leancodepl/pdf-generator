import { InvoiceItemsTableData, InvoiceItemsTableLabels, LocalizationOptions, TaxesData, TaxesTableLabels } from ".."
import { useInvoiceTemplate } from "./useInvoiceTemplate"

const totalString = "€5,055.00"
const taxValueString = "690,00\xa0zł"
const netValueString = "￥2,000.00"

describe("useInvoiceTemplate", () => {
  it("should calculate correct total", () => {
    const {
      taxesTable: { data },
      total,
    } = useInvoiceTemplate({
      localizationOptions: localizationOptions1,
      invoiceItemsTableData: invoiceItemsTableData1,
      taxesData: taxesData1,
      invoiceItemsTableLabels,
      taxesTableLabels,
    })

    expect(data[data.length - 1]["grossValue"]).toEqual(totalString)
    expect(total).toEqual(totalString)
  })

  it("should calculate correct taxValue", () => {
    const {
      taxesTable: { data },
    } = useInvoiceTemplate({
      localizationOptions: localizationOptions2,
      invoiceItemsTableData: invoiceItemsTableData2,
      taxesData: taxesData2,
      invoiceItemsTableLabels,
      taxesTableLabels,
    })

    expect(data[data.length - 1]["taxValue"]).toEqual(taxValueString)
  })

  it("should calculate correct netValue", () => {
    const {
      taxesTable: { data },
    } = useInvoiceTemplate({
      localizationOptions: localizationOptions3,
      invoiceItemsTableData: invoiceItemsTableData3,
      taxesData: taxesData3,
      invoiceItemsTableLabels,
      taxesTableLabels,
    })

    expect(data[data.length - 1]["netValue"]).toEqual(netValueString)
  })
})

const invoiceItemsTableData1: InvoiceItemsTableData = [
  {
    name: "name1",
    count: 10,
    priceEach: 150.0,
    taxKey: "vat",
  },
  {
    name: "name2",
    count: 10,
    priceEach: 200.0,
    taxKey: "vat",
  },
  {
    name: "name3",
    count: 5,
    priceEach: 100.0,
    taxKey: "vat2",
  },
]

const taxesData1: TaxesData = {
  vat: 23,
  vat2: 50,
}

const invoiceItemsTableData2: InvoiceItemsTableData = [
  {
    name: "name1",
    count: 10,
    priceEach: 100.0,
    taxKey: "vat",
  },
  {
    name: "name2",
    count: 10,
    priceEach: 100.0,
    taxKey: "vat",
  },
  {
    name: "name3",
    count: 10,
    priceEach: 100.0,
    taxKey: "vat",
  },
]

const taxesData2: TaxesData = {
  vat: 23,
}

const invoiceItemsTableData3: InvoiceItemsTableData = [
  {
    name: "name1",
    count: 10,
    priceEach: 100.0,
    taxKey: "vat1",
  },
  {
    name: "name2",
    count: 10,
    priceEach: 100.0,
    taxKey: "vat3",
  },
]

const taxesData3: TaxesData = {
  vat1: 23,
  vat2: 5,
  vat3: 10,
}

const invoiceItemsTableLabels: InvoiceItemsTableLabels = {
  index: "Lp",
  name: "Nazwa",
  unit: "Jednostka",
  count: "Ilość",
  netValueEach: "Cena netto",
  taxRate: "Stawka",
  netValue: "Wartość netto",
  grossValue: "Wartość brutto",
}

const taxesTableLabels: TaxesTableLabels = {
  taxRate: "Stawka VAT",
  netValue: "Wartość netto",
  taxValue: "Kwota VAT",
  grossValue: "Wartość brutto",
  total: "Razem",
}

const localizationOptions = {
  dateFormat: "yyyy-MM-d",
  documentDateLabel: "Data wystawienia:",
  sellDateLabel: "Data sprzedaży:",
  dueDateLabel: "Termin płatności:",
  paymentMethodLabel: "Metoda płatności:",
  sellerLabel: "Sprzedawca",
  buyerLabel: "Nabywca",
  totalLabel: "Suma:",
}

const localizationOptions1: LocalizationOptions = {
  locale: "en-EN",
  currency: "EUR",
  ...localizationOptions,
}

const localizationOptions2: LocalizationOptions = {
  locale: "pl-PL",
  currency: "PLN",
  ...localizationOptions,
}

const localizationOptions3: LocalizationOptions = {
  locale: "ja-JP",
  currency: "JPY",
  ...localizationOptions,
}
