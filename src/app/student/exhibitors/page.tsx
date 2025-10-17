"use client"

import { ExhibitorCard } from "@/app/student/exhibitors/_components/ExhibitorCard";
import { useFilteredExhibitors } from "@/app/student/exhibitors/_components/ExhibitorFilter";
import { Exhibitor } from "@/components/shared/hooks/api/fetchExhibitors";
import { Page } from "@/components/shared/Page";

export default function ExhibitorsPage() {
  const {
    exhibitors,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedIndustryIds,
    setSelectedIndustryIds,
  } = useFilteredExhibitors();


  // 🧩 Dynamically collect all industries from the data
  // går att hämta direkt från api, ändra i framtiden 
  const allIndustries = Array.from(
    new Map(
      exhibitors
        .flatMap((ex) => ex.industries || [])
        .map((ind) => [ind.id, ind])
    ).values()
  );

  const toggleIndustry = (id: number) => {
    setSelectedIndustryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) return <p>Loading exhibitors...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!exhibitors) return <p>No exhibitors available.</p>; // <- ensures non-null below

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>

        <div className="py-6 space-y-4">
          {/* Filters */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name..."
            className="border rounded p-2 w-full"
          />

          <div className="flex gap-2 flex-wrap">
            {allIndustries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => toggleIndustry(industry.id)}
                className={`px-3 py-1 rounded-full border ${selectedIndustryIds.includes(industry.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                {industry.name}
              </button>
            ))}
          </div>

          {/* Exhibitor Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exhibitors.map((exhibitor: Exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
            ))}

          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
