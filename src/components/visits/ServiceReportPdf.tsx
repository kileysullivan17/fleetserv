import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {
  Company,
  Photo,
  ServiceLineItem,
  ServiceVisit,
  Truck,
} from "@/types/database";
import { SERVICE_TYPE_LABELS } from "@/utils/format";

const NAVY = "#1B2B45";
const TEAL = "#0E8C7A";
const SAND = "#F7F6F3";
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
    fontSize: 18,
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
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    borderBottomWidth: 1.5,
    borderBottomColor: NAVY,
    paddingBottom: 4,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: SAND_DARK,
    paddingBottom: 4,
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
  colService: { width: "22%" },
  colDescription: { width: "58%", paddingRight: 8 },
  colQty: { width: "10%", textAlign: "right" },
  colUnit: { width: "10%", paddingLeft: 8 },
  cellService: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  cellText: {
    fontSize: 9,
    color: GRAY,
  },
  sectionSpacer: {
    marginBottom: 24,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoItem: {
    width: "48%",
    marginBottom: 14,
  },
  photoImage: {
    width: "100%",
    height: 150,
    objectFit: "contain",
    backgroundColor: SAND,
    borderWidth: 0.5,
    borderColor: SAND_DARK,
    borderRadius: 3,
  },
  photoCaption: {
    fontSize: 8,
    color: GRAY,
    marginTop: 4,
  },
  emptyNote: {
    fontSize: 9,
    color: LIGHT_GRAY,
    fontStyle: "italic",
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

function displayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export interface ServiceReportPdfProps {
  visit: ServiceVisit;
  truck: Truck;
  company: Company;
  lineItems: ServiceLineItem[];
  photos: Photo[];
  // Date the report was generated, formatted by the caller so this stays a
  // pure render.
  preparedOn: string;
}

// A customer-facing record of a service visit: what was inspected or performed
// plus the technician's photos (tread depth, coolant level, and so on). It
// carries no pricing. Send it alongside the invoice to show the work behind it.
export function ServiceReportPdf({
  visit,
  truck,
  company,
  lineItems,
  photos,
  preparedOn,
}: ServiceReportPdfProps) {
  return (
    <Document
      title={`Service Report ${displayDate(visit.visit_date)}`}
      author="FleetServ Hawaii"
    >
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
            <Text style={styles.docTitle}>SERVICE REPORT</Text>
            <Text style={styles.metaLine}>
              Service date:{" "}
              <Text style={styles.metaValue}>
                {displayDate(visit.visit_date)}
              </Text>
            </Text>
            <Text style={styles.metaLine}>
              Prepared: <Text style={styles.metaValue}>{preparedOn}</Text>
            </Text>
          </View>
        </View>

        {/* Prepared for and vehicle info */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Prepared For</Text>
            <Text style={styles.infoName}>{company.name}</Text>
            <Text style={styles.infoLine}>{company.contact_name}</Text>
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
              Technician: {visit.technician_name}
            </Text>
          </View>
        </View>

        {/* Technician notes */}
        {visit.notes ? (
          <View>
            <Text style={styles.sectionTitle}>Technician Notes</Text>
            <Text style={styles.notesText}>{visit.notes}</Text>
          </View>
        ) : null}

        {/* Work performed */}
        <View style={styles.sectionSpacer}>
          <Text style={styles.sectionTitle}>Work Performed</Text>
          {lineItems.length > 0 ? (
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colService]}>
                  Service
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colDescription]}>
                  Description
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
                <Text style={[styles.tableHeaderCell, styles.colUnit]}>
                  Unit
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
                  <Text style={[styles.cellText, styles.colQty]}>
                    {Number(item.quantity)}
                  </Text>
                  <Text style={[styles.cellText, styles.colUnit]}>
                    {item.unit}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNote}>No services were recorded.</Text>
          )}
        </View>

        {/* Inspection photos */}
        <View>
          <Text style={styles.sectionTitle}>Inspection Photos</Text>
          {photos.length > 0 ? (
            <View style={styles.photoGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem} wrap={false}>
                  <Image src={photo.storage_url} style={styles.photoImage} />
                  {photo.caption ? (
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNote}>
              No photos were recorded for this visit.
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            FleetServ Hawaii. Fleet servicing across the islands.
          </Text>
          <Text style={styles.footerText}>
            {company.name}. Unit {truck.unit_number}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
