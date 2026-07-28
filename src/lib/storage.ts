import { CompanySettings, DEFAULT_COMPANY_SETTINGS } from "@/types/company";
import { DocumentRecord, DocumentTypeId, StoredTemplate } from "@/types/document";

const KEYS = {
  company: "trendhona-hr:company-settings",
  documents: "trendhona-hr:documents",
  templates: "trendhona-hr:templates",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ---------------- Company settings ----------------

export function getCompanySettings(): CompanySettings {
  return readJSON(KEYS.company, DEFAULT_COMPANY_SETTINGS);
}

export function saveCompanySettings(settings: CompanySettings) {
  writeJSON(KEYS.company, settings);
}

// ---------------- Generated documents (metadata only) ----------------

export function getDocuments(): DocumentRecord[] {
  return readJSON<DocumentRecord[]>(KEYS.documents, []);
}

export function addDocument(record: DocumentRecord) {
  const all = getDocuments();
  all.unshift(record);
  writeJSON(KEYS.documents, all.slice(0, 500));
}

export function deleteDocument(id: string) {
  const all = getDocuments().filter((d) => d.id !== id);
  writeJSON(KEYS.documents, all);
}

// ---------------- Editable templates ----------------

export function getStoredTemplates(): Record<string, StoredTemplate> {
  return readJSON<Record<string, StoredTemplate>>(KEYS.templates, {});
}

export function getStoredTemplate(id: DocumentTypeId): StoredTemplate | null {
  const all = getStoredTemplates();
  return all[id] ?? null;
}

export function saveStoredTemplate(id: DocumentTypeId, html: string) {
  const all = getStoredTemplates();
  all[id] = { documentType: id, html, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.templates, all);
}

export function resetStoredTemplate(id: DocumentTypeId) {
  const all = getStoredTemplates();
  delete all[id];
  writeJSON(KEYS.templates, all);
}
