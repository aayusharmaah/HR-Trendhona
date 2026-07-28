"use client";

import { useCallback, useEffect, useState } from "react";
import { DocumentRecord } from "@/types/document";
import { addDocument, deleteDocument, getDocuments } from "@/lib/storage";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setDocuments(getDocuments());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setHydrated(true);
  }, [refresh]);

  const record = useCallback(
    (doc: DocumentRecord) => {
      addDocument(doc);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      deleteDocument(id);
      refresh();
    },
    [refresh]
  );

  return { documents, record, remove, hydrated, refresh };
}
