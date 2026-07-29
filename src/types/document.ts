export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "number"
  | "select"
  | "textarea";

export type AutoFillKind =
  | "currentDate"
  | "employeeId"
  | "probationEndDate"
  | "internshipDuration"
  | "salaryInWords";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  /** Variable name, used as {{key}} inside templates */
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  /** Grouping for the smart form (e.g. "Candidate", "Role", "Compensation") */
  group: string;
  autoFill?: AutoFillKind;
  /** Other field key(s) this auto-fill depends on, e.g. probation end depends on joining date */
  dependsOn?: string[];
  helpText?: string;
}

export type DocumentTypeId =
  | "internship-offer"
  | "full-time-offer"
  | "appointment"
  | "nda"
  | "relieving"
  | "employment-agreement"
  | "internship-agreement"
  | "experience-letter"
  | "warning-letter"
  | "promotion-letter"
  | "salary-revision"
  | "confirmation-letter"
  | "internship-completion"
  | "employment-verification"
  | "recommendation-letter"
  | "background-verification-consent"
  | "reference-check-form";

export interface DocumentTypeDefinition {
  id: DocumentTypeId;
  name: string;
  shortName: string;
  description: string;
  category: "Onboarding" | "Legal" | "Offboarding" | "Performance" | "Verification";
  icon: string; // lucide icon name, resolved in the UI layer
  available: boolean; // false = "coming soon" in this build
  fields: FieldConfig[];
  /** Rich-text template body. Paragraphs separated by \n\n. Supports {{variables}}. */
  defaultTemplate: string;
}

export interface DocumentRecord {
  id: string;
  documentType: DocumentTypeId;
  documentTypeName: string;
  candidateName: string;
  email: string;
  designation: string;
  generatedAt: string; // ISO timestamp
  fileName: string;
  data: Record<string, string>;
}

export interface StoredTemplate {
  documentType: DocumentTypeId;
  html: string; // Tiptap-authored HTML, may contain {{variables}}
  updatedAt: string;
}
