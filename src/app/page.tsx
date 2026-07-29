"use client";

import Link from "next/link";
import { FileCheck2, GraduationCap, FileSignature, ShieldCheck, Sparkles } from "lucide-react";

import { useDocuments } from "@/hooks/use-documents";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentDocumentsTable } from "@/components/dashboard/recent-documents-table";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { documents, remove, hydrated } = useDocuments();

  const today = new Date().toISOString().slice(0, 10);
  const generatedToday = documents.filter((d) => d.generatedAt.slice(0, 10) === today).length;
  const count = (type: string) => documents.filter((d) => d.documentType === type).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Generate a professional HR document in under a minute.
          </p>
        </div>
        <Button variant="brand" size="lg" asChild>
          <Link href="/generate">
            <Sparkles className="h-4 w-4" />
            Quick Generate
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Generated Today" value={hydrated ? generatedToday : "—"} icon={Sparkles} accent="purple" />
        <StatCard
          label="Internship Letters"
          value={hydrated ? count("internship-offer") : "—"}
          icon={GraduationCap}
          accent="cyan"
        />
        <StatCard
          label="Offer Letters"
          value={hydrated ? count("full-time-offer") : "—"}
          icon={FileSignature}
          accent="pink"
        />
        <StatCard
          label="Appointment Letters"
          value={hydrated ? count("appointment") : "—"}
          icon={FileCheck2}
          accent="purple"
        />
        <StatCard label="NDAs" value={hydrated ? count("nda") : "—"} icon={ShieldCheck} accent="cyan" />
      </div>

      <RecentDocumentsTable documents={hydrated ? documents : []} onDelete={remove} />
    </div>
  );
}
