"use client";

import * as React from "react";
import { FileX2, Search, Trash2 } from "lucide-react";

import { DocumentRecord } from "@/types/document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateLong } from "@/lib/format";
import { ALL_DOCUMENT_TYPES } from "@/lib/templates/registry";

export function RecentDocumentsTable({
  documents,
  onDelete,
}: {
  documents: DocumentRecord[];
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState("");

  const filtered = documents.filter((doc) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      doc.candidateName.toLowerCase().includes(q) ||
      doc.email.toLowerCase().includes(q) ||
      doc.designation.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || doc.documentType === typeFilter;
    const matchesDate = !dateFilter || doc.generatedAt.slice(0, 10) === dateFilter;
    return matchesQuery && matchesType && matchesDate;
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by candidate, email, or designation"
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="Document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All document types</SelectItem>
              {ALL_DOCUMENT_TYPES.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            className="sm:w-44"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            <FileX2 className="h-6 w-6" />
            <p className="text-sm">
              {documents.length === 0
                ? "No documents generated yet. Head to Generate Documents to create your first one."
                : "No documents match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Candidate</th>
                  <th className="py-2 pr-4 font-medium">Document</th>
                  <th className="py-2 pr-4 font-medium">Designation</th>
                  <th className="py-2 pr-4 font-medium">Generated</th>
                  <th className="py-2 pr-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{doc.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{doc.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline">{doc.documentTypeName}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{doc.designation || "—"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDateLong(doc.generatedAt.slice(0, 10))}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete record"
                        onClick={() => onDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
