"use client";

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

  return (
    <div className="relative w-full h-full">
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
            <FairMap exhibitors={exhibitors} MapComponent={m.component} />
          </div>
        ))}
      </div>
    </div>
  );
}
