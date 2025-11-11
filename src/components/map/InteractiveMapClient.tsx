"use client";

import CompanySearch from "@/components/map/CompanySearch";
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import { useState } from "react";
import FairMap from "./FairMap";
import FloorSelector from "./FloorSelector";
import { MAPS } from "./maps";

interface InteractiveMapClientProps {
  exhibitors: Exhibitor[];
}

export default function InteractiveMapClient({ exhibitors }: InteractiveMapClientProps) {
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const selectedMap = MAPS[selectedMapIndex];
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);

  const handleCompanySelect = (ex: Exhibitor) => {
    const boothNumber = parseInt(ex.fairLocation.replace("booth", ""), 10);
    let targetFloorIndex = 0;
    if (boothNumber >= 71 && boothNumber <= 96) targetFloorIndex = 1;
    else if (boothNumber >= 97 && boothNumber <= 111) targetFloorIndex = 2;

    setSelectedMapIndex(targetFloorIndex);
    setSelectedExhibitor(ex);
  };

  return (
    <div className="relative w-full h-full">
      <CompanySearch exhibitors={exhibitors.filter(e => e.fairLocation)} onSelect={handleCompanySelect} />

      <FloorSelector
        floors={MAPS.map(m => m.name)}
        selectedFloor={selectedMap.name}
        onSelect={name => {
          const index = MAPS.findIndex(m => m.name === name);
          if (index !== -1) setSelectedMapIndex(index);
        }}
      />

      <div className="relative w-full h-full">
        {MAPS.map((m, i) => (
          <div
            key={m.name}
            className={`absolute inset-0 transition-opacity duration-300 ${i === selectedMapIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            <FairMap
              exhibitors={exhibitors}
              MapComponent={m.component}
              currentFloorIndex={i}
              selectedExhibitor={selectedExhibitor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
