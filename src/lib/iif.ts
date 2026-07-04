import type {
  Company,
  Invoice,
  ServiceLineItem,
} from "@/types/database";

// IIF is a tab-delimited flat file format QuickBooks accepts for manual
// import. Invoice transactions use a TRNS row (Accounts Receivable debit,
// positive) followed by SPL rows (income credits, negative), then ENDTRNS.

const AR_ACCOUNT = "Accounts Receivable";
const SALES_ACCOUNT = "Sales";
const TAX_ACCOUNT = "Sales Tax Payable";

// IIF fields cannot contain tabs or newlines
function sanitize(value: string): string {
  return value.replace(/[\t\r\n]+/g, " ").trim();
}

// QuickBooks item names cap at 31 characters
function itemName(description: string): string {
  return sanitize(description).slice(0, 31);
}

// IIF dates are MM/DD/YYYY
function iifDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${month}/${day}/${year}`;
}

function amount(value: number): string {
  return value.toFixed(2);
}

export interface InvoiceIifInput {
  invoice: Invoice;
  company: Company;
  lineItems: ServiceLineItem[];
}

export function buildInvoiceIif({
  invoice,
  company,
  lineItems,
}: InvoiceIifInput): string {
  const date = iifDate(invoice.issued_date);
  const customer = sanitize(company.name);
  const docnum = sanitize(invoice.invoice_number);
  const taxName = `GE Tax ${company.hawaii_county} County`;

  const header = [
    "!TRNS\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO",
    "!SPL\tTRNSTYPE\tDATE\tACCNT\tNAME\tAMOUNT\tDOCNUM\tMEMO\tQNTY\tPRICE\tINVITEM\tTAXABLE",
    "!ENDTRNS",
  ];

  // AR debit for the full total, positive
  const trns = [
    "TRNS",
    "INVOICE",
    date,
    AR_ACCOUNT,
    customer,
    amount(Number(invoice.total)),
    docnum,
    `FleetServ Hawaii service invoice ${docnum}`,
  ].join("\t");

  // Income credits per line item, negative amounts and quantities
  const itemRows = lineItems.map((item) => {
    const description = sanitize(item.description);
    return [
      "SPL",
      "INVOICE",
      date,
      SALES_ACCOUNT,
      customer,
      amount(-Number(item.subtotal)),
      docnum,
      description,
      String(-Number(item.quantity)),
      amount(Number(item.unit_price)),
      itemName(item.description),
      "Y",
    ].join("\t");
  });

  // County GET tax credit
  const taxRow = [
    "SPL",
    "INVOICE",
    date,
    TAX_ACCOUNT,
    sanitize(taxName),
    amount(-Number(invoice.tax_amount)),
    docnum,
    `${taxName} at ${Number(company.tax_rate)}%`,
    "",
    "",
    "",
    "N",
  ].join("\t");

  return [...header, trns, ...itemRows, taxRow, "ENDTRNS", ""].join("\r\n");
}

export function downloadIif(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
