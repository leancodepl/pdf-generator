import { FunctionComponent } from "react"
import { InvoiceBase, InvoiceBaseProps, InvoiceValues } from ".."
import { useInvoiceTemplate } from "./useInvoiceTemplate"

export type InvoiceItemsTableData = {
  name: string
  count: number
  priceEach: number
  taxKey: string
}[]

export type InvoiceItemsTableLabels = {
  index: string
  name: string
  unit: string
  count: string
  netValueEach: string
  taxRate: string
  netValue: string
  grossValue: string
}

export type TaxesData = Record<string, number>

export type TaxesTableLabels = {
  taxRate: string
  netValue: string
  taxValue: string
  grossValue: string
  total: string
}

export type InvoiceTemplateValues = Omit<InvoiceValues, "total">

type InvoiceTemplateProps = Pick<InvoiceBaseProps, "localizationOptions"> & {
  invoiceItemsTableData: InvoiceItemsTableData
  taxesData: TaxesData
  invoiceItemsTableLabels: InvoiceItemsTableLabels
  taxesTableLabels: TaxesTableLabels
  invoiceValues: InvoiceTemplateValues
}

export const InvoiceTemplate: FunctionComponent<InvoiceTemplateProps> = ({
  localizationOptions,
  invoiceValues,
  invoiceItemsTableData,
  taxesData,
  invoiceItemsTableLabels,
  taxesTableLabels,
}) => {
  const { invoiceItemsTable, taxesTable, total } = useInvoiceTemplate({
    localizationOptions,
    invoiceItemsTableData,
    taxesData,
    invoiceItemsTableLabels,
    taxesTableLabels,
  })

  return (
    <InvoiceBase
      invoiceItemsTable={invoiceItemsTable}
      invoiceValues={{ ...invoiceValues, total }}
      localizationOptions={localizationOptions}
      taxesTable={taxesTable}
    />
  )
}
