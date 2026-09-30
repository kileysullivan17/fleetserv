# Form Template format

Format version: 1 (2026-09-30)

This file is copied, unchanged, into both FleetServ and Gridledger. If you edit it, edit both copies in the same change and raise the format version. The terms used here are defined in each repo's `CONTEXT.md`.

## What a template is

A Form Template is one JSON document. It defines a form's structure and nothing else: no styling, no layout hints for a specific site, no stored answers. Each site renders it its own way.

```json
{
  "format_version": 1,
  "template_id": "truck-pm-inspection",
  "version": 3,
  "form_type": "inspection",
  "title": "Preventive maintenance inspection",
  "sections": [
    {
      "id": "tires",
      "title": "Tires",
      "items": [
        { "id": "lf-tread", "label": "Front left tread", "type": "pass_fail_na", "required": true, "allow_photo": true },
        { "id": "lf-psi", "label": "Front left pressure", "type": "number", "unit": "psi", "min": 0, "max": 150 }
      ]
    }
  ]
}
```

## Template fields

| Field | Required | Meaning |
|---|---|---|
| `format_version` | yes | Version of this spec the template follows. |
| `template_id` | yes | Stable identifier for the template across all its versions. |
| `version` | yes | Template Version number. A version that has been used for a Form is never edited; changes produce the next number. |
| `form_type` | yes | One of `inspection`, `daily_log`, `observation`, `incident_report`. |
| `title` | yes | Name shown to the person filling it in. |
| `sections` | yes | Ordered list of sections. |

Each section has an `id`, a `title`, and an ordered list of `items`.

## Item fields

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable within the template, and kept the same across versions when the question means the same thing, so answers can be compared over time. |
| `label` | yes | The question as shown. |
| `type` | yes | One of the answer types below. |
| `required` | no | Default `false`. A Form cannot be completed while a required Item has no Response. |
| `help` | no | One line of guidance under the question. |
| `allow_photo` | no | Default `false`. Lets a Photo be linked to this Item's Response. |

## Answer types, version 1

| Type | Extra fields | Response value |
|---|---|---|
| `pass_fail_na` | `fail_opens_observation` (default `true`) | `"pass"`, `"fail"`, or `"na"` |
| `number` | `unit` (required), `min`, `max`, `step` | a number |
| `choice` | `options`: list of `{ "id", "label" }` | one option `id` |
| `signature` | `signer`: `"technician"` or `"customer"` | a captured signature, its signer's name, and the time signed |
| `text` | `multiline` (default `false`) | a string |
| `date` | none | an ISO 8601 date |

A photo is not an answer type. Any Item with `allow_photo` can carry Photos alongside its value.

## Planned later, not in version 1

Multi-select choice, rating scale, time of day, and location. Each will be added as a new type under a new format version, never by changing an existing type.

## Rules every renderer follows

1. **Unknown types never break a Form.** A renderer that meets a type it does not support shows the Item as read-only with the note "Not supported in this version" and keeps going. This is what lets new types ship to one site before the other.
2. **A Form renders its pinned Template Version**, never the latest one.
3. **Every Response is identified by an ID created where it was filled in**, not assigned by the server. Forms need a connection in version 1, but this keeps offline saving possible later without reworking stored data.
4. **Values are stored as typed values**, never flattened into prose.
