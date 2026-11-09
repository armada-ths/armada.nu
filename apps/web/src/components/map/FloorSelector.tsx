"use client"

interface FloorSelectorProps {
  floors: string[]
  selectedFloor: string
  onSelect: (floor: string) => void
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onSelect
}: FloorSelectorProps) {
  return (
    <div className="bg-snow/90 absolute top-24 left-1/2 z-30 flex w-max max-w-full -translate-x-1/2 flex-wrap justify-center gap-2 rounded-full p-2 shadow-lg backdrop-blur-md">
      {floors.map(floor => (
        <button
          key={floor}
          onClick={() => onSelect(floor)}
          className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
            selectedFloor === floor
              ? "text-snow bg-emerald-700"
              : "text-licorice bg-gray-200 hover:bg-gray-300"
          }`}>
          {floor}
        </button>
      ))}
    </div>
  )
}
