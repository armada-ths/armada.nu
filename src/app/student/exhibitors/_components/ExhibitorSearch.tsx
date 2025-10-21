"use client";

import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import { useMemo, useState } from "react";
import { ExhibitorCard } from "./ExhibitorCard";

interface Props {
  exhibitors: Exhibitor[];
}

export default function ExhibitorSearch({ exhibitors }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return q
      ? exhibitors.filter((ex) => ex.name.toLowerCase().includes(q))
      : exhibitors;
  }, [searchQuery, exhibitors]);

  return (
    <div className="py-6 space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by company name..."
        className="border rounded p-2 w-full"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
        ))}
      </div>
    </div>
  );
}
