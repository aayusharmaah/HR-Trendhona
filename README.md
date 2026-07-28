# Trendhona HR Document Generator

Generate offer letters, appointment letters, NDAs, and other HR documents as
professional, letterhead-branded PDFs in under a minute. No backend, no
database — everything runs in the browser and persists to `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. First stop: **Company Settings**, so your logo,
address, and signatories are ready to auto-populate every document.

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint     # ESLint (0 errors/warnings as of this build)
```

## What's implemented in this build

| Screen | Status |
|---|---|
| Dashboard (KPIs, recent documents, search) | ✅ |
| Generate Documents (smart form + live preview + PDF export) | ✅ |
| Templates (list + rich-text editor) | ✅ |
| Company Settings | ✅ |
| Light / dark mode | ✅ |

**5 of 17 document types are fully wired up** (fields, template, PDF export):
Internship Offer Letter, Full-Time Offer Letter, Appointment Letter, NDA,
Relieving Letter. The remaining 12 (Employment Agreement, Internship
Agreement, Experience Letter, Warning Letter, Promotion Letter, Salary
Revision, Confirmation Letter, Internship Completion Certificate, Employment
Verification, Recommendation Letter, Background Verification Consent,
Reference Check Form) appear in the UI as **"Coming soon"** cards — the
architecture already accounts for them, so finishing each one is a small,
mechanical addition (see below), not a new feature.

## Architecture

```
src/
  app/                    Routes (App Router): /, /generate, /templates, /templates/[id], /settings
  components/
    ui/                   Hand-built shadcn/ui-style primitives (button, card, dialog, select, ...)
    layout/                Sidebar, mobile sheet, theme toggle, app shell
    dashboard/              Stat cards, recent documents + search/filter
    generator/              Document type grid, dynamic smart form, live "paper" preview
    templates/              Template list, Tiptap rich-text editor + toolbar
    settings/               Company settings form (logo/stamp upload)
  lib/
    templates/
      common-fields.ts       Shared FieldConfig builders (name, email, dates, salary, PAN, ...)
      definitions/            One file per document type (fields + default HTML template)
      registry.ts             ALL_DOCUMENT_TYPES — single source of truth
      render.ts               Merges form data + company settings into {{variables}}
      schema.ts               Builds a Zod schema from a FieldConfig[] at runtime
      sample-data.ts          Placeholder data for previewing a template with no real candidate
    pdf/
      html-to-blocks.ts       Parses Tiptap HTML into paragraphs/headings/lists/tables
      generate-pdf.ts         Lays those blocks onto A4 pages with pdf-lib (letterhead, footer, page numbers)
    storage.ts                localStorage read/write (company settings, documents, custom templates)
    format.ts                 Indian-numbering salary-to-words, date helpers, employee ID, duration/probation calc
  hooks/                     use-company-settings, use-documents, use-template (SSR-safe localStorage hydration)
  types/                     CompanySettings, DocumentTypeDefinition, FieldConfig, DocumentRecord
```

Every screen (generator, live preview, PDF export, template editor) is
**generic** — it reads whatever is in `ALL_DOCUMENT_TYPES`. Nothing is
hardcoded per document type outside of `lib/templates/definitions/`.

## Adding one of the remaining 12 document types

This is the intended way to grow the app. Using **Experience Letter** as an example:

1. **Create the definition** — `src/lib/templates/definitions/experience-letter.ts`:
   ```ts
   import { DocumentTypeDefinition } from "@/types/document";
   import { candidateNameField, designationField, departmentField, joiningDateField, lastWorkingDateField } from "@/lib/templates/common-fields";

   export const experienceLetter: DocumentTypeDefinition = {
     id: "experience-letter",
     name: "Experience Letter",
     shortName: "Experience Letter",
     description: "Summarizes an employee's role, tenure, and performance.",
     category: "Offboarding",
     icon: "Award",
     available: true, // flip from false
     fields: [candidateNameField, designationField, departmentField, joiningDateField, lastWorkingDateField],
     defaultTemplate: `<p>{{today_formatted}}</p><h2>Subject: Experience Letter</h2>...`,
   };
   ```
   Reuse field builders from `common-fields.ts` wherever possible; add a new
   one there if a field doesn't exist yet (rare — most HR fields are already
   covered).

2. **Register it** — in `src/lib/templates/registry.ts`, replace the
   `comingSoonDocuments.find(...)!` line for that id with an import of your
   new `experienceLetter` definition.

3. **Delete the stub** — remove the matching entry from
   `src/lib/templates/definitions/coming-soon.ts`.

That's it. The document grid, smart form, validation, live preview, template
editor, and PDF export all pick it up automatically — there is no
per-document-type UI code to write.

## Notes & known limitations (v1)

- **PDF rendering is hand-built on `pdf-lib`** (no headless Chrome / HTML-to-PDF
  service involved), so it works fully offline and stays fast. It supports
  bold/italic, headings, bullet/numbered lists, tables, and alignment. It does
  **not** support underline or nested lists in the exported PDF (the editor
  lets you apply underline for on-screen preview purposes, but it's dropped on
  PDF export) — extending `lib/pdf/html-to-blocks.ts` and `generate-pdf.ts` to
  support these is straightforward if needed.
- **Logo/stamp uploads** are stored as base64 data URLs directly in
  `localStorage`. Keep logo files small (under ~200KB) — `localStorage` has a
  browser-enforced ~5–10MB ceiling per origin.
- **Single-user, single-browser**: there's no backend, so documents and
  settings don't sync across devices or team members. If Trendhona needs
  multi-user HR access later, `lib/storage.ts` is the one file to swap for a
  real API client — every hook and component already goes through it.
- Company Stamp is stored and available as a variable/asset but isn't drawn
  onto the PDF automatically yet (logo is); wiring it in is a small addition
  to `drawLetterhead()` in `generate-pdf.ts`.
