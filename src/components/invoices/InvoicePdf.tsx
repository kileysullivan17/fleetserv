import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type {
  Company,
  Invoice,
  ServiceLineItem,
  ServiceVisit,
  Truck,
} from "@/types/database";
import { SERVICE_TYPE_LABELS } from "@/utils/format";

const NAVY = "#1B2B45";
const TEAL = "#0E8C7A";
const SAND_DARK = "#EAE7E1";
const GRAY = "#6B7280";
const LIGHT_GRAY = "#9CA3AF";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: NAVY,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandMark: {
    width: 28,
    height: 28,
    backgroundColor: TEAL,
    borderRadius: 4,
    marginRight: 8,
  },
  brandName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  brandSub: {
    fontSize: 8,
    color: TEAL,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  docMeta: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginBottom: 4,
  },
  metaLine: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 2,
  },
  metaValue: {
    color: NAVY,
    fontFamily: "Helvetica-Bold",
  },
  infoRow: {
    flexDirection: "row",
    gap: 32,
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    color: LIGHT_GRAY,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  infoLine: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 1.5,
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: NAVY,
    paddingBottom: 5,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: SAND_DARK,
    paddingVertical: 6,
  },
  colService: { width: "18%" },
  colDescription: { width: "38%", paddingRight: 8 },
  colQty: { width: "10%", textAlign: "right" },
  colUnit: { width: "10%", paddingLeft: 8 },
  colPrice: { width: "12%", textAlign: "right" },
  colSubtotal: { width: "12%", textAlign: "right" },
  cellService: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  cellText: {
    fontSize: 9,
    color: GRAY,
  },
  cellMono: {
    fontSize: 9,
  },
  totalsBlock: {
    alignSelf: "flex-end",
    width: 200,
    marginBottom: 40,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 9,
    color: GRAY,
  },
  totalsValue: {
    fontSize: 9,
  },
  totalsFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: NAVY,
    paddingTop: 5,
    marginTop: 3,
  },
  totalsFinalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  totalsFinalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },
  payNote: {
    marginTop: "auto",
    borderTopWidth: 0.5,
    borderTopColor: SAND_DARK,
    paddingTop: 12,
  },
  payNoteText: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 0.5,
    borderTopColor: SAND_DARK,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: LIGHT_GRAY,
  },
});

function money(value: number): string {
  return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function displayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export interface InvoicePdfProps {
  invoice: Invoice;
  visit: ServiceVisit;
  truck: Truck;
  company: Company;
  lineItems: ServiceLineItem[];
}

export function InvoicePdf({
  invoice,
  visit,
  truck,
  company,
  lineItems,
}: InvoicePdfProps) {
  return (
    <Document title={invoice.invoice_number} author="FleetServ Hawaii">
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <View style={styles.brandMark} />
            <View>
              <Text style={styles.brandName}>FleetServ</Text>
              <Text style={styles.brandSub}>Hawaii</Text>
            </View>
          </View>
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>INVOICE</Text>
            <Text style={styles.metaLine}>
              Invoice No:{" "}
              <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
            </Text>
            <Text style={styles.metaLine}>
              Issued:{" "}
              <Text style={styles.metaValue}>
                {displayDate(invoice.issued_date)}
              </Text>
            </Text>
            <Text style={styles.metaLine}>
              Due:{" "}
              <Text style={styles.metaValue}>
                {displayDate(invoice.due_date)}
              </Text>
            </Text>
          </View>
        </View>

        {/* Bill to and vehicle info */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoName}>{company.name}</Text>
            <Text style={styles.infoLine}>{company.contact_name}</Text>
            <Text style={styles.infoLine}>{company.billing_address}</Text>
            <Text style={styles.infoLine}>{company.contact_email}</Text>
            <Text style={styles.infoLine}>{company.contact_phone}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Vehicle</Text>
            <Text style={styles.infoName}>
              Unit {truck.unit_number}: {truck.year} {truck.make} {truck.model}
            </Text>
            <Text style={styles.infoLine}>VIN: {truck.vin}</Text>
            <Text style={styles.infoLine}>Plate: {truck.license_plate}</Text>
            <Text style={styles.infoLine}>
              Service date: {displayDate(visit.visit_date)}
            </Text>
            <Text style={styles.infoLine}>
              Technician: {visit.technician_name}
            </Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colService]}>
              Service
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colSubtotal]}>
              Subtotal
            </Text>
          </View>

          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={[styles.cellService, styles.colService]}>
                {SERVICE_TYPE_LABELS[item.service_type]}
              </Text>
              <Text style={[styles.cellText, styles.colDescription]}>
                {item.description}
              </Text>
              <Text style={[styles.cellMono, styles.colQty]}>
                {Number(item.quantity)}
              </Text>
              <Text style={[styles.cellText, styles.colUnit]}>{item.unit}</Text>
              <Text style={[styles.cellMono, styles.colPrice]}>
                {money(Number(item.unit_price))}
              </Text>
              <Text style={[styles.cellMono, styles.colSubtotal]}>
                {money(Number(item.subtotal))}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {money(Number(invoice.subtotal))}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>
              Tax ({Number(company.tax_rate)}%, {company.hawaii_county} County)
            </Text>
            <Text style={styles.totalsValue}>
              {money(Number(invoice.tax_amount))}
            </Text>
          </View>
          <View style={styles.totalsFinal}>
            <Text style={styles.totalsFinalLabel}>Total Due</Text>
            <Text style={styles.totalsFinalValue}>
              {money(Number(invoice.total))}
            </Text>
          </View>
        </View>

        {/* Payment note */}
        <View style={styles.payNote}>
          <Text style={styles.payNoteText}>
            Payment due by {displayDate(invoice.due_date)}. Please reference
            invoice {invoice.invoice_number} with your payment.
          </Text>
          <Text style={styles.payNoteText}>
            Mahalo for your business.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            FleetServ Hawaii. Fleet servicing across the islands.
          </Text>
          <Text style={styles.footerText}>Invoice {invoice.invoice_number}</Text>
        </View>
      </Page>
    </Document>
  );
}
