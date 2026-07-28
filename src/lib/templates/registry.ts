import { DocumentTypeDefinition, DocumentTypeId } from "@/types/document";
import { internshipOfferLetter } from "@/lib/templates/definitions/internship-offer";
import { fullTimeOfferLetter } from "@/lib/templates/definitions/full-time-offer";
import { appointmentLetter } from "@/lib/templates/definitions/appointment";
import { ndaLetter } from "@/lib/templates/definitions/nda";
import { relievingLetter } from "@/lib/templates/definitions/relieving";
import { comingSoonDocuments } from "@/lib/templates/definitions/coming-soon";

// Order mirrors the original product spec's "Choose Document" list.
export const ALL_DOCUMENT_TYPES: DocumentTypeDefinition[] = [
  internshipOfferLetter,
  fullTimeOfferLetter,
  appointmentLetter,
  ndaLetter,
  comingSoonDocuments.find((d) => d.id === "employment-agreement")!,
  comingSoonDocuments.find((d) => d.id === "internship-agreement")!,
  relievingLetter,
  comingSoonDocuments.find((d) => d.id === "experience-letter")!,
  comingSoonDocuments.find((d) => d.id === "warning-letter")!,
  comingSoonDocuments.find((d) => d.id === "promotion-letter")!,
  comingSoonDocuments.find((d) => d.id === "salary-revision")!,
  comingSoonDocuments.find((d) => d.id === "confirmation-letter")!,
  comingSoonDocuments.find((d) => d.id === "internship-completion")!,
  comingSoonDocuments.find((d) => d.id === "employment-verification")!,
  comingSoonDocuments.find((d) => d.id === "recommendation-letter")!,
  comingSoonDocuments.find((d) => d.id === "background-verification-consent")!,
  comingSoonDocuments.find((d) => d.id === "reference-check-form")!,
];

export function getDocumentType(id: DocumentTypeId): DocumentTypeDefinition | undefined {
  return ALL_DOCUMENT_TYPES.find((d) => d.id === id);
}

export function getAvailableDocumentTypes(): DocumentTypeDefinition[] {
  return ALL_DOCUMENT_TYPES.filter((d) => d.available);
}

export const DOCUMENT_CATEGORIES = [
  "Onboarding",
  "Legal",
  "Offboarding",
  "Performance",
  "Verification",
] as const;
