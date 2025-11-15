"use client";

interface FloorSelectorProps {
  floors: string[];
  selectedFloor: string;
  onSelect: (floor: string) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onSelect,
}: FloorSelectorProps) {
  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-md rounded-full flex gap-2 p-2 shadow-lg w-96">
      {floors.map(floor => (
        <button
          key={floor}
          onClick={() => onSelect(floor)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${selectedFloor === floor
            ? "bg-emerald-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
        >
          {floor}
        </button>
      ))}
    </div>
  );
}
