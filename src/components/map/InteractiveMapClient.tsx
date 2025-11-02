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

      <FairMap exhibitors={exhibitors} MapComponent={selectedMap.component} />
    </div>
  );
}
