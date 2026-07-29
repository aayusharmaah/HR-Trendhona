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

  // Internship stipend clause — resolves to unpaid / fixed / incentive-based prose
  if (doc.fields.some((f) => f.key === "stipend_type")) {
    vars.stipend_clause = buildStipendClause(vars);
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

/**
 * Builds the internship stipend paragraph from the selected stipend type.
 * Values are already resolved (formatted amount / words) so the result is
 * plain prose with no unresolved {{placeholders}}.
 */
function buildStipendClause(vars: Record<string, string>): string {
  const type = (vars.stipend_type || "fixed").toLowerCase();
  const amount = vars.stipend_formatted; // undefined when no stipend entered
  const words = vars.stipend_words ? ` (${vars.stipend_words})` : "";
  const details = vars.incentive_details?.trim();

  if (type === "unpaid") {
    return (
      "This is an <strong>unpaid internship</strong>, undertaken purely for learning and professional experience. " +
      "You will not be entitled to any stipend or monetary compensation during the internship period. " +
      "On successful completion, you will be issued a Certificate of Internship recognising your contribution and the experience gained."
    );
  }

  if (type === "incentive") {
    const structure = details
      ? ` against the following structure: ${details}`
      : " against the performance targets and deliverables communicated to you at the start of the internship";

    if (amount) {
      return (
        `Your internship carries an <strong>incentive-linked stipend</strong>. This comprises a fixed base stipend of ` +
        `<strong>${amount}</strong>${words} per month, together with performance-based incentives earned${structure}. ` +
        "Incentives will be assessed and disbursed at the end of each month based on the achievement of the agreed targets, subject to applicable deductions."
      );
    }

    return (
      `Your internship carries a purely <strong>incentive-based (performance-linked) stipend</strong>. You will earn incentives${structure}. ` +
      "All earnings will be assessed and disbursed at the end of each month based on the achievement of the agreed targets and deliverables, subject to applicable deductions."
    );
  }

  // Fixed monthly stipend (default)
  if (amount) {
    return (
      `You will be entitled to a monthly stipend of <strong>${amount}</strong>${words}, ` +
      "payable at the end of each month, subject to applicable deductions."
    );
  }
  return (
    "You will be entitled to a monthly stipend as communicated to you separately, " +
    "payable at the end of each month, subject to applicable deductions."
  );
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
