# FleetServ

## Language

**Asset**:
The thing a Form is filled out against. In FleetServ, always a Truck.

**Form Template**:
The definition of a form: its Form Type, sections, Items, and answer types. Written in the template format shared with Gridledger.
_Avoid_: checklist, form definition

**Template Version**:
One frozen snapshot of a Form Template. Editing a template that has been used produces a new version; a used version never changes.

**Form Type**:
The kind of form: Inspection, Daily Log, Observation, or Incident Report.

**Form**:
One filled-in instance of a Template Version, against one Asset, on one Service Visit.
_Avoid_: submission, report, checklist

**Item**:
One question within a Form Template.

**Response**:
The answer to one Item on one Form: a value, a note, and optionally a photo.
_Avoid_: answer, result

**Observation**:
An issue raised against an Asset and tracked to closed. It can be opened directly, or from a Response marked Fail.
_Avoid_: finding, defect, deficiency

**Photo**:
An image taken during a Service Visit. It belongs to the visit, and may also be linked to one Response or one Observation.

**Customer-visible**:
A Photo the technician has left marked for the customer. Photos are customer-visible unless the technician hides them.
_Avoid_: public, shared

**Service Report**:
The customer-facing document for a visit: its Forms, Responses, Observations, and every customer-visible Photo, grouped by Form and Item.
_Avoid_: inspection report, visit PDF

**Evidence Photo**:
A customer-visible Photo linked to an Observation that became a billed line. Only Evidence Photos appear on an invoice.

## Relationships

- A **Form** pins exactly one **Template Version**, and always renders the Items of that version, never the current one.
- A **Form** holds one **Response** per **Item**.
- A **Response** marked Fail opens an **Observation** linked back to that Response and its photo.
- An **Observation** may lead to a quote line, but is not one: an Observation the customer declines stays on the record.
- A **Photo** always belongs to a Service Visit; a link to a **Response** or **Observation** is optional.
- The **Service Report** shows every customer-visible **Photo**; the invoice shows only **Evidence Photos**.
