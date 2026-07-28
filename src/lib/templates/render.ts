import { CompanySettings } from "@/types/company";
import { DocumentTypeDefinition } from "@/types/document";
import { formatDateLong, formatINR, salaryToWords, todayISODate } from "@/lib/format";

const CURRENCY_KEYS = new Set(["stipend", "ctc", "salary", "bonus"]);

/**
 * Combines candidate form data with company settings into a single flat
 * variable map, adding derived {{key}_formatted} / {{key}_words} helpers
 * so templates can reference either the raw or human-readable value.
 */
export function buildVariableMap(
  doc: DocumentTypeDefinition,
  data: Record<string, string>,
  company: CompanySettings
): Record<string, string> {
  const vars: Record<string, string> = { ...data };

  for (const field of doc.fields) {
    const raw = data[field.key];
    if (!raw) continue;

    if (field.type === "date") {
      vars[`${field.key}_formatted`] = formatDateLong(raw);
    }
    if (field.type === "number" && CURRENCY_KEYS.has(field.key)) {
      vars[`${field.key}_formatted`] = formatINR(raw);
      vars[`${field.key}_words`] = salaryToWords(raw);
    }
  }

  vars.today_formatted = formatDateLong(todayISODate());

  // Company settings — automatically populate every document
  vars.company_name = company.companyName || "";
  vars.office_address = company.officeAddress || "";
  vars.company_email = company.companyEmail || "";
  vars.website = company.website || "";
  vars.gst = company.gst || "";
  vars.phone = vars.phone || company.phone || "";
  vars.hr_name = company.hrName || "";
  vars.ceo_name = company.ceoName || "";
  vars.authorized_signatory = company.authorizedSignatory || company.hrName || "";

  return vars;
}

const PLACEHOLDER_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Replaces every {{variable}} in the template with its resolved value (or a visible blank marker). */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(PLACEHOLDER_RE, (_match, key: string) => {
    const value = vars[key];
    return value && value.trim().length > 0 ? value : `<span class="missing-field">[${key}]</span>`;
  });
}

/** Returns every {{variable}} key referenced by a template, in order of first appearance. */
export function extractTemplateVariables(template: string): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER_RE);
  while ((match = re.exec(template)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      found.push(match[1]);
    }
  }
  return found;
}
