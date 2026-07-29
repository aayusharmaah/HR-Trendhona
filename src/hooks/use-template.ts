"use client";

import { useCallback, useEffect, useState } from "react";
import { DocumentTypeId } from "@/types/document";
import { getDocumentType } from "@/lib/templates/registry";
import { getStoredTemplate, resetStoredTemplate, saveStoredTemplate } from "@/lib/storage";

export function useTemplate(id: DocumentTypeId) {
  const definition = getDocumentType(id);
  const [html, setHtml] = useState<string>(definition?.defaultTemplate ?? "");
  const [isCustom, setIsCustom] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrating from localStorage, unavailable during SSR */
    const stored = getStoredTemplate(id);
    if (stored) {
      setHtml(stored.html);
      setIsCustom(true);
    } else {
      setHtml(definition?.defaultTemplate ?? "");
      setIsCustom(false);
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = useCallback(
    (nextHtml: string) => {
      saveStoredTemplate(id, nextHtml);
      setHtml(nextHtml);
      setIsCustom(true);
    },
    [id]
  );

  const resetToDefault = useCallback(() => {
    resetStoredTemplate(id);
    setHtml(definition?.defaultTemplate ?? "");
    setIsCustom(false);
  }, [id, definition?.defaultTemplate]);

  return { definition, html, isCustom, hydrated, save, resetToDefault };
}
